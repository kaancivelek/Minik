using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using backend.Data;
using backend.Models;


namespace Minik.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TinyHousesController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public TinyHousesController(IConfiguration configuration, ApplicationDbContext context)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _context = context; // DbContext bağlanıyor
        }

        // GET: api/TinyHouses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TinyHouse>>> GetTinyHouses()
        {
            var houses = new List<TinyHouse>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand(@"
            SELECT T.*, 
                   L.country, 
                   L.city,
                   (SELECT AVG(CAST(rating AS FLOAT)) 
                    FROM reviews 
                    WHERE tiny_house_id = T.id) AS average_rating
            FROM tiny_houses T
            JOIN locations L ON T.location_id = L.id
            WHERE T.is_freezed = 0", conn);

                var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    houses.Add(new TinyHouse
                    {
                        Id = (int)reader["id"],
                        Name = reader["name"].ToString(),
                        Description = reader["description"] as string,
                        LocationId = (int)reader["location_id"],
                        PricePerNight = (decimal)reader["price_per_night"],
                        MaxGuests = (int)reader["max_guests"],
                        property_owner_id = (int)reader["property_owner_id"],
                        Amenities = reader["amenities"] as string,
                        Country = reader["country"].ToString(),
                        City = reader["city"].ToString(),
                        Rating = reader["average_rating"] == DBNull.Value ? 0 : Convert.ToInt32(reader["average_rating"])

                    });
                }
            }

            return Ok(houses);
        }


        [HttpGet("catalog")]
        public async Task<ActionResult<IEnumerable<TinyHouse>>> GetTinyHousesPaged([FromQuery] int page = 1)
        {
            const int pageSize = 8;
            var houses = new List<TinyHouse>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();


                int totalCount = 0;
                var countCmd = new SqlCommand("SELECT COUNT(*) FROM tiny_houses WHERE is_freezed = 1", conn);
                totalCount = (int)await countCmd.ExecuteScalarAsync();

                // Sayfalama sorgusu
                string query = @"
            SELECT T.*, L.country, L.city 
            FROM tiny_houses T
            JOIN locations L ON T.location_id = L.id
            WHERE T.is_freezed = 0 
            ORDER BY T.id
            OFFSET @offset ROWS 
            FETCH NEXT @pageSize ROWS ONLY";

                var cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@offset", (page - 1) * pageSize);
                cmd.Parameters.AddWithValue("@pageSize", pageSize);

                var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    houses.Add(new TinyHouse
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                        LocationId = reader.GetInt32(3),
                        PricePerNight = reader.GetDecimal(4),
                        MaxGuests = reader.GetInt32(5),
                        property_owner_id = reader.GetInt32(6),
                        Amenities = reader.IsDBNull(7) ? null : reader.GetString(7),
                        Country = reader.GetString(8),
                        City = reader.GetString(9)
                    });
                }

                var result = new
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    Houses = houses
                };

                return Ok(result);
            }
        }



        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<TinyHouse>>> GetTinyHousesPaged([FromQuery] int offset = 0, [FromQuery] int limit = 8)
        {
            var houses = new List<TinyHouse>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                // 1. Availability prosedürü çalıştır
                using (var cmdUpdate = new SqlCommand("EXEC sp_UpdateAvailabilityStatus", conn))
                {
                    await cmdUpdate.ExecuteNonQueryAsync();
                }

                // 2. Sadece is_freezed = 1 olanları getir
                string query = @"
            SELECT T.*, L.country, L.city, 
                   (SELECT CEILING(AVG(rating)) 
                    FROM reviews 
                    WHERE T.id = reviews.tiny_house_id) AS average_rating
            FROM tiny_houses T
            INNER JOIN locations L ON T.location_id = L.id
               INNER JOIN availability A ON A.tiny_house_id = T.id
   WHERE T.is_freezed = 0 AND A.is_available = 1
            ORDER BY T.id
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@offset", offset);
                    cmd.Parameters.AddWithValue("@limit", limit);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            houses.Add(new TinyHouse
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                                LocationId = reader.GetInt32(3),
                                PricePerNight = reader.GetDecimal(4),
                                MaxGuests = reader.GetInt32(5),
                                property_owner_id = reader.GetInt32(6),
                                Amenities = reader.IsDBNull(7) ? null : reader.GetString(7),
                                Country = reader.GetString(9),
                                City = reader.GetString(10),
                                Rating = reader.IsDBNull(11) ? 0 : reader.GetInt32(11)
                            });
                        }
                    }
                }
            }

            return Ok(houses);
        }





        // GET: api/TinyHouses/
        [HttpGet("{id}")]
        public async Task<ActionResult<TinyHouse>> GetTinyHouse(int id)
        {
            TinyHouse? house = null;

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand(@"
            SELECT * FROM dbo.GetTinyHouseDetailsById(@id)
        ", conn);

                cmd.Parameters.AddWithValue("@id", id);

                var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    house = new TinyHouse
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Name = reader["name"].ToString(),
                        Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString(),
                        LocationId = Convert.ToInt32(reader["location_id"]),
                        PricePerNight = Convert.ToDecimal(reader["price_per_night"]),
                        MaxGuests = Convert.ToInt32(reader["max_guests"]),
                        property_owner_id = Convert.ToInt32(reader["property_owner_id"]),
                        Amenities = reader["amenities"] == DBNull.Value ? null : reader["amenities"].ToString(),
                        City = reader["city"].ToString(),
                        Country = reader["country"].ToString(),
                        Rating = reader["average_rating"] == DBNull.Value
                                 ? 0
                                 : Convert.ToInt32(Math.Round(Convert.ToDouble(reader["average_rating"])))
                    };
                }
            }

            return house == null ? NotFound() : Ok(house);
        }


        // GET: api/TinyHouses/
        [HttpGet("by-owner/{property_owner_id}")]
        public async Task<ActionResult<List<TinyHouse>>> GetTinyHouseByPropertyOwnerId(int property_owner_id)
        {
            var houses = new List<TinyHouse>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand(@"
            SELECT T.*, L.country, L.city
            FROM tiny_houses T
            JOIN locations L ON T.location_id = L.id
            WHERE T.property_owner_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", property_owner_id);

                var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    houses.Add(new TinyHouse
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                        LocationId = reader.GetInt32(3),
                        PricePerNight = reader.GetDecimal(4),
                        MaxGuests = reader.GetInt32(5),
                        property_owner_id = reader.GetInt32(6),
                        Amenities = reader.IsDBNull(7) ? null : reader.GetString(7),
                        Country = reader.GetString(9),
                        City = reader.GetString(10)
                    });
                }
            }

            return houses.Count == 0 ? NotFound() : Ok(houses);
        }

        [HttpPost("add")]
        public IActionResult AddTinyHouse([FromBody] TinyHousesDTO dto)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var query = @"
            INSERT INTO tiny_houses 
            (name, description, location_id, price_per_night, max_guests, property_owner_id, amenities)
            VALUES 
            (@name, @description, @location_id, @price_per_night, @max_guests, @owner_id, @amenities)";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@name", dto.Name);
                    cmd.Parameters.AddWithValue("@description", (object)dto.Description ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@location_id", dto.LocationId);
                    cmd.Parameters.AddWithValue("@price_per_night", dto.PricePerNight);
                    cmd.Parameters.AddWithValue("@max_guests", dto.MaxGuests);
                    cmd.Parameters.AddWithValue("@owner_id", dto.PropertyOwnerId);
                    cmd.Parameters.AddWithValue("@amenities", (object)dto.Amenities ?? DBNull.Value);

                    cmd.ExecuteNonQuery();
                }
            }

            return Ok("Tiny house başarıyla eklendi.");
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteTinyHouse(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "DELETE FROM tiny_houses WHERE id = @id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound(new { Message = "Belirtilen ID ile eşleşen ev bulunamadı." });
                    }
                }
            }

            return Ok(new { Message = "Tiny house başarıyla silindi." });
        }


        [HttpPatch("update/{id}")]
        public IActionResult PatchTinyHouse(int id, [FromBody] TinyHousesDTO2 update)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                List<string> setClauses = new List<string>();
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = conn;

                if (update.Name != null)
                {
                    setClauses.Add("name = @name");
                    cmd.Parameters.AddWithValue("@name", update.Name);
                }
                if (update.Description != null)
                {
                    setClauses.Add("description = @description");
                    cmd.Parameters.AddWithValue("@description", update.Description);
                }
                if (update.City != null)
                {
                    setClauses.Add("city = @city");
                    cmd.Parameters.AddWithValue("@city", update.City);
                }
                if (update.Country != null)
                {
                    setClauses.Add("country = @country");
                    cmd.Parameters.AddWithValue("@country", update.Country);
                }
                if (update.PricePerNight.HasValue)
                {
                    setClauses.Add("price_per_night = @price_per_night");
                    cmd.Parameters.AddWithValue("@price_per_night", update.PricePerNight.Value);
                }
                if (update.MaxGuests.HasValue)
                {
                    setClauses.Add("max_guests = @max_guests");
                    cmd.Parameters.AddWithValue("@max_guests", update.MaxGuests.Value);
                }
                if (update.PropertyOwnerId.HasValue)
                {
                    setClauses.Add("property_owner_id = @property_owner_id");
                    cmd.Parameters.AddWithValue("@property_owner_id", update.PropertyOwnerId.Value);
                }
                if (update.Amenities != null)
                {
                    setClauses.Add("amenities = @amenities");
                    cmd.Parameters.AddWithValue("@amenities", update.Amenities);
                }

                if (!setClauses.Any())
                {
                    return BadRequest("Güncellenecek herhangi bir alan belirtilmedi.");
                }

                cmd.CommandText = $"UPDATE tiny_houses SET {string.Join(", ", setClauses)} WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);

                int affected = cmd.ExecuteNonQuery();
                if (affected == 0)
                {
                    return NotFound("Belirtilen ID ile eşleşen tiny house bulunamadı.");
                }
            }

            return Ok(new { Message = "Tiny house başarıyla güncellendi." });
        }





    }
}