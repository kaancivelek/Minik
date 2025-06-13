﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;

namespace backend.Controllers
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

            string storedHash = null;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "SELECT password_hash FROM users WHERE email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", loginRequest.Email);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            storedHash = reader["password_hash"].ToString();
                        }
                        else
                        {
                            return Unauthorized("Kullanıcı bulunamadı.");
                        }
                    }
                }
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, storedHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Şifre hatalı.");
            }

            return Ok("Giriş başarılı.");
        }
    }
}