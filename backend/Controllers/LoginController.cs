using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;
using System;
using System.Text;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly string _connectionString;

        public LoginController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginRequest)
        {
            if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.PasswordHash))
            {
                return BadRequest("E-posta ve şifre gereklidir.");
            }

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "SELECT id, full_name, email, password_hash, role_id FROM users WHERE email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", loginRequest.Email);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedHash = reader["password_hash"].ToString();
                            int roleId = reader.IsDBNull(reader.GetOrdinal("role_id")) ? 1 : reader.GetInt32(reader.GetOrdinal("role_id"));

                            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, storedHash);
                            if (!isPasswordValid)
                            {
                                return Unauthorized("Şifre hatalı.");
                            }

                            // Token üret
                            string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

                            return Ok(new
                            {
                                token,
                                roleId
                            });
                        }
                        else
                        {
                            return Unauthorized("Kullanıcı bulunamadı.");
                        }
                    }
                }
            }
        }
    }
}