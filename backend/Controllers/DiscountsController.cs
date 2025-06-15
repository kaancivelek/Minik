using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public DiscountsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/discounts
        [HttpGet]
        public IActionResult GetAllDiscounts()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var discounts = new List<object>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM discounts";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        discounts.Add(new
                        {
                            Id = reader.GetInt32(0),
                            TinyHouseId = reader.GetInt32(1),
                            DiscountPercentage = reader.GetInt32(2),
                            ValidFrom = reader.GetDateTime(3),
                            ValidUntil = reader.GetDateTime(4)
                        });
                    }
                }
            }
            return Ok(discounts);
        }

        // GET: api/discounts/{id}
        [HttpGet("{id}")]
        public IActionResult GetDiscountById(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object discount = null;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM discounts WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            discount = new
                            {
                                Id = reader.GetInt32(0),
                                TinyHouseId = reader.GetInt32(1),
                                DiscountPercentage = reader.GetInt32(2),
                                ValidFrom = reader.GetDateTime(3),
                                ValidUntil = reader.GetDateTime(4)
                            };
                        }
                    }
                }
            }
            if (discount == null)
                return NotFound("İndirim kaydı bulunamadı.");
            return Ok(discount);
        }

        // POST: api/discounts
        [HttpPost]
        public IActionResult AddDiscount([FromBody] Discount discount)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"INSERT INTO discounts (tiny_house_id, discount_percentage, valid_from, valid_until)
                                 VALUES (@TinyHouseId, @DiscountPercentage, @ValidFrom, @ValidUntil)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", discount.TinyHouseId);
                    cmd.Parameters.AddWithValue("@DiscountPercentage", discount.DiscountPercentage);
                    cmd.Parameters.AddWithValue("@ValidFrom", discount.ValidFrom);
                    cmd.Parameters.AddWithValue("@ValidUntil", discount.ValidUntil);
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok("İndirim kaydı başarıyla eklendi.");
        }

        // PATCH: api/discounts/{id}
        [HttpPatch("{id}")]
        public IActionResult UpdateDiscount(int id, [FromBody] Discount update)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"UPDATE discounts SET tiny_house_id = @TinyHouseId, discount_percentage = @DiscountPercentage, valid_from = @ValidFrom, valid_until = @ValidUntil WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@TinyHouseId", update.TinyHouseId);
                    cmd.Parameters.AddWithValue("@DiscountPercentage", update.DiscountPercentage);
                    cmd.Parameters.AddWithValue("@ValidFrom", update.ValidFrom);
                    cmd.Parameters.AddWithValue("@ValidUntil", update.ValidUntil);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Güncellenecek indirim kaydı bulunamadı.");
                }
            }
            return Ok("İndirim kaydı başarıyla güncellendi.");
        }

        // DELETE: api/discounts/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteDiscount(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM discounts WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Silinecek indirim kaydı bulunamadı.");
                }
            }
            return Ok("İndirim kaydı başarıyla silindi.");
        }
    }
} 