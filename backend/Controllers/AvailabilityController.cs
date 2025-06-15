using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using backend.Models;
using System.Text.Json;

namespace backend.Controllers
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
                string query = @"
                    INSERT INTO availability (tiny_house_id, available_from, available_to, is_available)
                    VALUES (@TinyHouseId, @AvailableFrom, @AvailableTo, @IsAvailable)";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", availability.TinyHouseId);
                    cmd.Parameters.AddWithValue("@AvailableFrom", availability.AvailableFrom);
                    cmd.Parameters.AddWithValue("@AvailableTo", availability.AvailableTo);
                    cmd.Parameters.AddWithValue("@IsAvailable", availability.IsAvailable);

                    cmd.ExecuteNonQuery();
                }
            }

            return Ok("Uygunluk bilgisi başarıyla eklendi.");
        }

        // PATCH: api/availability/{id}
        [HttpPatch("{id}")]
        public IActionResult UpdateAvailability(int id, [FromBody] JsonElement updatedFields)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                string selectQuery = "SELECT * FROM availability WHERE id = @Id";
                Availability existing = null;

                using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                {
                    selectCmd.Parameters.AddWithValue("@Id", id);
                    using (var reader = selectCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            existing = new Availability
                            {
                                Id = id,
                                TinyHouseId = (int)reader["tiny_house_id"],
                                AvailableFrom = (DateTime)reader["available_from"],
                                AvailableTo = (DateTime)reader["available_to"],
                                IsAvailable = (bool)reader["is_available"]
                            };
                        }
                        else
                        {
                            return NotFound("Güncellenecek uygunluk kaydı bulunamadı.");
                        }
                    }
                }

                // Gelen değerlerle eskiyi güncelle
                if (updatedFields.TryGetProperty("available_from", out var fromProp))
                    existing.AvailableFrom = fromProp.GetDateTime();
                if (updatedFields.TryGetProperty("available_to", out var toProp))
                    existing.AvailableTo = toProp.GetDateTime();
                if (updatedFields.TryGetProperty("is_available", out var availableProp))
                    existing.IsAvailable = availableProp.GetBoolean();

                string updateQuery = @"
            UPDATE availability 
            SET available_from = @From,
                available_to = @To,
                is_available = @IsAvailable
            WHERE id = @Id";

                using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                {
                    updateCmd.Parameters.AddWithValue("@From", existing.AvailableFrom);
                    updateCmd.Parameters.AddWithValue("@To", existing.AvailableTo);
                    updateCmd.Parameters.AddWithValue("@IsAvailable", existing.IsAvailable);
                    updateCmd.Parameters.AddWithValue("@Id", id);

                    updateCmd.ExecuteNonQuery();
                }
            }

            return Ok("Uygunluk başarıyla güncellendi.");
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
