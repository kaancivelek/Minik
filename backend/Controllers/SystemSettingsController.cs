using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;
using System;
using System.Collections.Generic;
using System.Text.Json;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemSettingsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SystemSettingsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/systemsettings
        [HttpGet]
        public IActionResult GetAllSettings()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var settings = new List<object>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM system_settings ORDER BY category, [key]";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        settings.Add(new
                        {
                            Id = reader.GetInt32(0),
                            Category = reader.GetString(1),
                            Key = reader.GetString(2),
                            Value = reader.GetString(3),
                            Description = reader.GetString(4),
                            DataType = reader.GetString(5),
                            CreatedAt = reader.GetDateTime(6),
                            UpdatedAt = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7)
                        });
                    }
                }
            }
            return Ok(settings);
        }

        // GET: api/systemsettings/category/{category}
        [HttpGet("category/{category}")]
        public IActionResult GetSettingsByCategory(string category)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var settings = new List<object>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM system_settings WHERE category = @Category ORDER BY [key]";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Category", category);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            settings.Add(new
                            {
                                Id = reader.GetInt32(0),
                                Category = reader.GetString(1),
                                Key = reader.GetString(2),
                                Value = reader.GetString(3),
                                Description = reader.GetString(4),
                                DataType = reader.GetString(5),
                                CreatedAt = reader.GetDateTime(6),
                                UpdatedAt = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7)
                            });
                        }
                    }
                }
            }
            return Ok(settings);
        }

        // GET: api/systemsettings/{id}
        [HttpGet("{id}")]
        public IActionResult GetSettingById(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object setting = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM system_settings WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            setting = new
                            {
                                Id = reader.GetInt32(0),
                                Category = reader.GetString(1),
                                Key = reader.GetString(2),
                                Value = reader.GetString(3),
                                Description = reader.GetString(4),
                                DataType = reader.GetString(5),
                                CreatedAt = reader.GetDateTime(6),
                                UpdatedAt = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7)
                            };
                        }
                    }
                }
            }

            if (setting == null)
                return NotFound("Ayar bulunamadı.");

            return Ok(setting);
        }

        // POST: api/systemsettings
        [HttpPost]
        public IActionResult CreateSetting([FromBody] SystemSetting setting)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"INSERT INTO system_settings 
                               (category, [key], value, description, data_type, created_at) 
                               VALUES (@Category, @Key, @Value, @Description, @DataType, @CreatedAt)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Category", setting.Category);
                    cmd.Parameters.AddWithValue("@Key", setting.Key);
                    cmd.Parameters.AddWithValue("@Value", setting.Value);
                    cmd.Parameters.AddWithValue("@Description", setting.Description);
                    cmd.Parameters.AddWithValue("@DataType", setting.DataType);
                    cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok("Ayar başarıyla oluşturuldu.");
        }

        // PATCH: api/systemsettings/{id}
        [HttpPatch("{id}")]
        public IActionResult UpdateSetting(int id, [FromBody] SystemSetting update)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"UPDATE system_settings 
                               SET value = @Value, 
                                   description = @Description, 
                                   updated_at = @UpdatedAt 
                               WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Value", update.Value);
                    cmd.Parameters.AddWithValue("@Description", update.Description);
                    cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Güncellenecek ayar bulunamadı.");
                }
            }
            return Ok("Ayar başarıyla güncellendi.");
        }

        // DELETE: api/systemsettings/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteSetting(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM system_settings WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Silinecek ayar bulunamadı.");
                }
            }
            return Ok("Ayar başarıyla silindi.");
        }
    }
} 