using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using backend.Models;

namespace Minik.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly string _connectionString;

        public LocationsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            var locations = new List<Location>();
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand("SELECT * FROM locations", conn);
                var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    locations.Add(MapLocation(reader));
                }
            }
            return Ok(locations);
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            Location? location = null;
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand("SELECT * FROM locations WHERE id = @id", conn);
                cmd.Parameters.AddWithValue("@id", id);
                var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    location = MapLocation(reader);
                }
            }
            return location == null ? NotFound() : Ok(location);
        }

 

        // GET: api/Locations/tinyhouse/5
        [HttpGet("tinyhouse/{tinyhouse_id}")]
        public async Task<ActionResult<Location>> GetLocationByTinyHouseId(int tinyhouse_id)
        {
            Location? location = null;
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand(@"
                    SELECT l.* FROM locations l
                    INNER JOIN tiny_houses t ON t.location_id = l.id
                    WHERE t.id = @tinyhouse_id", conn);
                cmd.Parameters.AddWithValue("@tinyhouse_id", tinyhouse_id);
                var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    location = MapLocation(reader);
                }
            }
            return location == null ? NotFound() : Ok(location);
        }

        // GET: api/Locations/propertyowner/5
        [HttpGet("propertyowner/{property_owner_id}")]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocationsByPropertyOwnerId(int property_owner_id)
        {
            var locations = new List<Location>();
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand(@"
                    SELECT L.* FROM locations L
                    INNER JOIN users U ON U.id = L.user_id
                    WHERE U.id = @property_owner_id", conn);
                cmd.Parameters.AddWithValue("@property_owner_id", property_owner_id);
                var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    locations.Add(MapLocation(reader));
                }
            }
            return Ok(locations);
        }

        // POST: api/Locations
        [HttpPost]
        public IActionResult AddLocation([FromBody] Location location)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new SqlCommand(@"
                    INSERT INTO locations (country, city, address, latitude, longitude, user_id)
                    VALUES (@country, @city, @address, @latitude, @longitude, @user_id)", conn);
                cmd.Parameters.AddWithValue("@country", location.Country ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@city", location.City ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@address", location.Address ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@latitude", (object?)location.Latitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@longitude", (object?)location.Longitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@user_id", (object?)location.User_Id ?? DBNull.Value);
                cmd.ExecuteNonQuery();
            }
            return Ok("Lokasyon başarıyla eklendi.");
        }

        // DELETE: api/Locations/5
        [HttpDelete("{id}")]
        public IActionResult DeleteLocation(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new SqlCommand("DELETE FROM locations WHERE id = @id", conn);
                cmd.Parameters.AddWithValue("@id", id);
                int affected = cmd.ExecuteNonQuery();
                if (affected == 0)
                    return NotFound("Belirtilen ID ile eşleşen lokasyon bulunamadı.");
            }
            return Ok("Lokasyon başarıyla silindi.");
        }

        // PUT: api/Locations/5
        [HttpPut("{id}")]
        public IActionResult UpdateLocation(int id, [FromBody] Location location)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var cmd = new SqlCommand(@"
                    UPDATE locations SET
                        country = @country,
                        city = @city,
                        address = @address,
                        latitude = @latitude,
                        longitude = @longitude,
                        user_id = @user_id
                    WHERE id = @id", conn);
                cmd.Parameters.AddWithValue("@country", location.Country ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@city", location.City ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@address", location.Address ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@latitude", (object?)location.Latitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@longitude", (object?)location.Longitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@user_id", (object?)location.User_Id ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@id", id);
                int affected = cmd.ExecuteNonQuery();
                if (affected == 0)
                    return NotFound("Belirtilen ID ile eşleşen lokasyon bulunamadı.");
            }
            return Ok("Lokasyon başarıyla güncellendi.");
        }

        // Helper
        private Location MapLocation(SqlDataReader reader)
        {
            return new Location
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                Country = reader["country"] as string,
                City = reader["city"] as string,
                Address = reader["address"] as string,
                Latitude = reader["latitude"] as decimal?,
                Longitude = reader["longitude"] as decimal?,
                User_Id = reader["user_id"] as int?
            };
        }
    }
}