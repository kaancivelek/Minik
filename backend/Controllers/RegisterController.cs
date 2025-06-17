using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using backend.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly string _connectionString;

        public RegisterController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Users2DTO user)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz giriş verileri.");

            if (!new EmailAddressAttribute().IsValid(user.Email))
                return BadRequest("Geçerli bir e-posta adresi girin.");

            if (!IsValidPassword(user.PasswordHash))
                return BadRequest("Şifre en az 8 karakter, bir büyük harf, bir rakam ve bir özel karakter içermelidir.");

            if (IsEmailAlreadyExists(user.Email))
                return BadRequest("Bu e-posta adresi zaten kullanılıyor.");

            if (IsPhoneNumberAlreadyExists(user.PhoneNumber))
                return BadRequest("Bu telefon numarası zaten kullanılıyor.");

            // role_id doğrulaması: 1=Customer, 2=Property Owner, 3=Admin
            int roleId = user.RoleId ?? 1; // null ise varsayılan olarak 1 (Customer)

            if (roleId < 1 || roleId > 3)
                return BadRequest("RoleId yalnızca 1 (Customer), 2 (Property Owner) veya 3 (Admin) olabilir.");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            int newUserId = 0;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = @"
                    INSERT INTO users (full_name, email, password_hash, role_id, phone_number)
                    OUTPUT INSERTED.id
                    VALUES (@full_name, @email, @password_hash, @role_id, @phone_number)";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@full_name", user.FullName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@password_hash", hashedPassword);
                    cmd.Parameters.AddWithValue("@role_id", roleId);
                    cmd.Parameters.AddWithValue("@phone_number", user.PhoneNumber);

                    newUserId = (int)cmd.ExecuteScalar();
                }
            }

            // Log ekle
            using (var context = new backend.Data.ApplicationDbContext(new Microsoft.EntityFrameworkCore.DbContextOptions<backend.Data.ApplicationDbContext>()))
            {
                var log = new backend.Models.AuditLog
                {
                    UserId = null, // Giriş yapan adminin id'si eklenebilir
                    Action = "Create",
                    Entity = "User",
                    EntityId = newUserId,
                    OldValue = null,
                    NewValue = JsonSerializer.Serialize(new {
                        Id = newUserId,
                        user.FullName,
                        user.Email,
                        RoleId = roleId,
                        user.PhoneNumber
                    }),
                    Timestamp = DateTime.UtcNow
                };
                context.AuditLogs.Add(log);
                context.SaveChanges();
            }

            return Ok(new { Message = "Kayıt başarılı." });
        }

        private bool IsEmailAlreadyExists(string email)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "SELECT COUNT(*) FROM users WHERE email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        private bool IsPhoneNumberAlreadyExists(string phoneNumber)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "SELECT COUNT(*) FROM users WHERE phone_number = @Phone";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Phone", phoneNumber);
                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        private bool IsValidPassword(string password)
        {
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => "!@#$%^&*()".Contains(ch));
        }
    }
}
