using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using backend.Models;
using System.Data.SqlClient;

namespace Minik.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HouseImagesController : ControllerBase
    {
        private readonly string _connectionString;

        public HouseImagesController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/HouseImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HouseImages>>> GetHouseImages()
        {
            var images = new List<HouseImages>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand("SELECT * FROM house_images", conn);
                var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    images.Add(new HouseImages
                    {
                        Id = reader.GetInt32(0),
                        TinyHouseId = reader.GetInt32(1),
                        ImageUrl = reader.IsDBNull(2) ? null : reader.GetString(2)
                    });
                }
            }

            return Ok(images); // Response'da durum kodu 200 döndürülecek
        }

        // GET: api/HouseImages/tiny_house_id
        [HttpGet("{tiny_house_id}")]
        public async Task<ActionResult<IEnumerable<HouseImages>>> GetHouseImagesByTinyHouseId(int tiny_house_id)
        {
            var images = new List<HouseImages>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                var cmd = new SqlCommand("SELECT * FROM house_images WHERE tiny_house_id = @tiny_house_id", conn);
                cmd.Parameters.AddWithValue("@tiny_house_id", tiny_house_id);

                var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    images.Add(new HouseImages
                    {
                        Id = reader.GetInt32(0),
                        TinyHouseId = reader.GetInt32(1),
                        ImageUrl = reader.IsDBNull(2) ? null : reader.GetString(2)
                    });
                }
            }

            if (images.Count == 0)
            {
                return NotFound(new { message = "No images found for this Tiny House." }); // 404 ve hata mesajı
            }

            return Ok(images); // 200 ile images listesi döndürülür
        }


        

            [HttpPost("{tinyHouseId}")]
            public IActionResult AddImageToTinyHouse(int tinyHouseId, [FromBody] HouseImagesDTO dto)
            {
                if (tinyHouseId <= 0)
                    return BadRequest("Geçerli bir Tiny House ID giriniz.");

                if (!IsValidUrl(dto.ImageUrl))
                    return BadRequest("Geçerli bir görsel URL giriniz.");

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    string query = @"INSERT INTO house_images (tiny_house_id, image_url)
                             VALUES (@TinyHouseId, @ImageUrl)";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                        cmd.Parameters.AddWithValue("@ImageUrl", dto.ImageUrl);

                        int affectedRows = cmd.ExecuteNonQuery();
                        if (affectedRows > 0)
                            return Ok("Görsel başarıyla eklendi.");
                        else
                            return StatusCode(500, "Görsel eklenemedi.");
                    }
                }
            }

            private bool IsValidUrl(string url)
            {
                return Uri.TryCreate(url, UriKind.Absolute, out Uri uriResult)
                       && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            }

        [HttpDelete("{imageId}")]
        public IActionResult DeleteImage(int imageId)
        {
            if (imageId <= 0)
                return BadRequest("Geçerli bir görsel ID giriniz.");

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "DELETE FROM house_images WHERE id = @ImageId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@ImageId", imageId);
                    int affectedRows = cmd.ExecuteNonQuery();

                    if (affectedRows == 0)
                        return NotFound("Belirtilen ID ile bir görsel bulunamadı.");

                    return Ok("Görsel başarıyla silindi.");
                }
            }
        }


    }


}




