using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Minik.Server.Models;
using System.Text.Json;

namespace Minik.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailabilityController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AvailabilityController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/availability
        [HttpGet]
        public IActionResult GetAllAvailability()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var availabilities = new List<Availability>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM availability";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        availabilities.Add(new Availability
                        {
                            Id = (int)reader["id"],
                            TinyHouseId = (int)reader["tiny_house_id"],
                            AvailableFrom = (DateTime)reader["available_from"],
                            AvailableTo = (DateTime)reader["available_to"],
                            IsAvailable = (bool)reader["is_available"]
                        });
                    }
                }
            }

            return Ok(availabilities);
        }

        // GET: api/availability/filter?from=2025-06-10&to=2025-06-20

        [HttpGet("filter")]
        public IActionResult GetAvailableInRange([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Availability> availableList = new List<Availability>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"
            SELECT * FROM availability
            WHERE is_available = 1
            AND available_from <= @To
            AND available_to >= @From";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@From", from);
                    cmd.Parameters.AddWithValue("@To", to);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            availableList.Add(new Availability
                            {
                                Id = (int)reader["id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                AvailableFrom = (DateTime)reader["available_from"],
                                AvailableTo = (DateTime)reader["available_to"],
                                IsAvailable = (bool)reader["is_available"]
                            });
                        }
                    }
                }
            }

            if (availableList.Count == 0)
                return NotFound("Bu tarihlerde uygun tiny house bulunamadı.");

            return Ok(availableList);
        }


        // GET: api/availability/tinyhouse/5
        [HttpGet("tinyhouse/{tinyHouseId}")]
        public IActionResult GetByTinyHouseId(int tinyHouseId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var availabilityList = new List<Availability>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM availability WHERE tiny_house_id = @TinyHouseId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            availabilityList.Add(new Availability
                            {
                                Id = (int)reader["id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                AvailableFrom = (DateTime)reader["available_from"],
                                AvailableTo = (DateTime)reader["available_to"],
                                IsAvailable = (bool)reader["is_available"]
                            });
                        }
                    }
                }
            }

            return Ok(availabilityList);
        }

        // GET: api/availability/active
        [HttpGet("active")]
        public IActionResult GetActiveAvailability()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var availableList = new List<Availability>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM availability WHERE is_available = 1";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        availableList.Add(new Availability
                        {
                            Id = (int)reader["id"],
                            TinyHouseId = (int)reader["tiny_house_id"],
                            AvailableFrom = (DateTime)reader["available_from"],
                            AvailableTo = (DateTime)reader["available_to"],
                            IsAvailable = (bool)reader["is_available"]
                        });
                    }
                }
            }

            return Ok(availableList);
        }



        // POST: api/availability
        [HttpPost]
        public IActionResult AddAvailability([FromBody] Availability availability)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // 🔍 1. Çakışma kontrolü: SADECE aktif (is_available = 1) olanlara bak!
                string checkQuery = @"
            SELECT COUNT(*) FROM availability
            WHERE tiny_house_id = @TinyHouseId
            AND is_available = 1
            AND (
                (available_from <= @AvailableTo AND available_to >= @AvailableFrom)
            )";

                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@TinyHouseId", availability.TinyHouseId);
                    checkCmd.Parameters.AddWithValue("@AvailableFrom", availability.AvailableFrom);
                    checkCmd.Parameters.AddWithValue("@AvailableTo", availability.AvailableTo);

                    int count = (int)checkCmd.ExecuteScalar();
                    if (count > 0)
                    {
                        return BadRequest("Bu tarih aralığında aktif bir uygunluk zaten mevcut.");
                    }
                }

                // ✅ 2. Eklemeye devam
                string insertQuery = @"
            INSERT INTO availability (tiny_house_id, available_from, available_to, is_available)
            VALUES (@TinyHouseId, @AvailableFrom, @AvailableTo, @IsAvailable)";

                using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn))
                {
                    insertCmd.Parameters.AddWithValue("@TinyHouseId", availability.TinyHouseId);
                    insertCmd.Parameters.AddWithValue("@AvailableFrom", availability.AvailableFrom);
                    insertCmd.Parameters.AddWithValue("@AvailableTo", availability.AvailableTo);
                    insertCmd.Parameters.AddWithValue("@IsAvailable", availability.IsAvailable);

                    insertCmd.ExecuteNonQuery();
                }
            }

            return Ok(new
            {
                message = "Uygunluk bilgisi başarıyla eklendi.",
                availability = availability
            });

        }


        // PATCH: api/availability/{id}

        [HttpPatch("{id}")]
        public IActionResult UpdateAvailability(int id, [FromBody] JsonElement updatedFields)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // Önce mevcut kayıt var mı kontrol et
                string selectQuery = "SELECT * FROM availability WHERE id = @Id";
                using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                {
                    selectCmd.Parameters.AddWithValue("@Id", id);
                    using (var reader = selectCmd.ExecuteReader())
                    {
                        if (!reader.Read())
                            return NotFound("Güncellenecek uygunluk kaydı bulunamadı.");
                    }
                }

                // Dinamik güncelleme için alanlar
                List<string> updates = new List<string>();
                var parameters = new List<SqlParameter>();

                if (updatedFields.TryGetProperty("tiny_house_id", out var houseProp))
                {
                    updates.Add("tiny_house_id = @TinyHouseId");
                    parameters.Add(new SqlParameter("@TinyHouseId", houseProp.GetInt32()));
                }

                if (updatedFields.TryGetProperty("available_from", out var fromProp))
                {
                    updates.Add("available_from = @AvailableFrom");
                    parameters.Add(new SqlParameter("@AvailableFrom", fromProp.GetDateTime()));
                }

                if (updatedFields.TryGetProperty("available_to", out var toProp))
                {
                    updates.Add("available_to = @AvailableTo");
                    parameters.Add(new SqlParameter("@AvailableTo", toProp.GetDateTime()));
                }

                if (updatedFields.TryGetProperty("is_available", out var isAvailableProp))
                {
                    updates.Add("is_available = @IsAvailable");
                    parameters.Add(new SqlParameter("@IsAvailable", isAvailableProp.GetBoolean()));
                }

                if (updates.Count == 0)
                    return BadRequest("Hiçbir güncelleme alanı gönderilmedi.");

                string updateQuery = $"UPDATE availability SET {string.Join(", ", updates)} WHERE id = @Id";
                using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                {
                    updateCmd.Parameters.AddWithValue("@Id", id);
                    foreach (var param in parameters)
                    {
                        updateCmd.Parameters.Add(param);
                    }

                    updateCmd.ExecuteNonQuery();
                }
            }

            return Ok("Uygunluk bilgisi başarıyla güncellendi.");
        }


        // DELETE: api/availability/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteAvailability(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM availability WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int affected = cmd.ExecuteNonQuery();

                    if (affected == 0)
                        return NotFound("Silinecek uygunluk kaydı bulunamadı.");
                }
            }

            return Ok("Uygunluk kaydı başarıyla silindi.");
        }
    }
}
