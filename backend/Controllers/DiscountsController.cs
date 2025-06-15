
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Minik.Server.Controllers
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

        // 1. Tüm indirimleri getir
        [HttpGet]
        public IActionResult GetAllDiscounts()
        {
            var discounts = new List<Discount>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var query = "SELECT * FROM discounts";
                using (var cmd = new SqlCommand(query, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        discounts.Add(new Discount
                        {
                            Id = (int)reader["id"],
                            TinyHouseId = (int)reader["tiny_house_id"],
                            DiscountPercentage = (int)reader["discount_percentage"],
                            ValidFrom = (DateTime)reader["valid_from"],
                            ValidUntil = (DateTime)reader["valid_until"]
                        });
                    }
                }
            }

            return Ok(discounts);
        }

        // 2. Belirli TinyHouseId'ye ait indirim getir
        [HttpGet("tinyhouse/{tinyHouseId}")]
        public IActionResult GetDiscountByTinyHouseId(int tinyHouseId)
        {
            Discount discount = null;
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var query = "SELECT * FROM discounts WHERE tiny_house_id = @TinyHouseId";
                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            discount = new Discount
                            {
                                Id = (int)reader["id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                DiscountPercentage = (int)reader["discount_percentage"],
                                ValidFrom = (DateTime)reader["valid_from"],
                                ValidUntil = (DateTime)reader["valid_until"]
                            };
                        }
                    }
                }
            }

            if (discount == null)
                return NotFound("Bu Tiny House için indirim bulunamadı.");

            return Ok(discount);
        }

        // 5. TinyHouseId’ye göre sadece indirim oranını güncelle (PATCH)
        [HttpPatch("tinyhouse/{tinyHouseId}")]
        public IActionResult UpdateDiscountPercentage(int tinyHouseId, [FromBody] int newPercentage)
        {
            if (newPercentage < 1 || newPercentage > 100)
                return BadRequest("İndirim oranı 1 ile 100 arasında olmalıdır.");

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var query = @"UPDATE discounts SET discount_percentage = @DiscountPercentage 
                      WHERE tiny_house_id = @TinyHouseId";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                    cmd.Parameters.AddWithValue("@DiscountPercentage", newPercentage);

                    int affected = cmd.ExecuteNonQuery();

                    if (affected == 0)
                        return NotFound("İndirim kaydı bulunamadı.");
                }
            }

            return Ok("İndirim oranı güncellendi.");
        }





        // 3. TinyHouseId’ye göre indirim Ekle veya Güncelle (Upsert)
        [HttpPut("tinyhouse/{tinyHouseId}")]
        public IActionResult UpsertDiscount(int tinyHouseId, [FromBody] Discount discount)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // Tiny House için indirim var mı?
                var checkQuery = "SELECT COUNT(*) FROM discounts WHERE tiny_house_id = @TinyHouseId";
                using (var checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                    int count = (int)checkCmd.ExecuteScalar();

                    string query;
                    if (count > 0)
                    {
                        // Güncelle
                        query = @"UPDATE discounts SET 
                                    discount_percentage = @DiscountPercentage,
                                    valid_from = @ValidFrom,
                                    valid_until = @ValidUntil 
                                  WHERE tiny_house_id = @TinyHouseId";
                    }
                    else
                    {
                        // Ekle
                        query = @"INSERT INTO discounts 
                                    (tiny_house_id, discount_percentage, valid_from, valid_until) 
                                  VALUES 
                                    (@TinyHouseId, @DiscountPercentage, @ValidFrom, @ValidUntil)";
                    }

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                        cmd.Parameters.AddWithValue("@DiscountPercentage", discount.DiscountPercentage);
                        cmd.Parameters.AddWithValue("@ValidFrom", discount.ValidFrom);
                        cmd.Parameters.AddWithValue("@ValidUntil", discount.ValidUntil);
                        cmd.ExecuteNonQuery();
                    }
                }
            }

            return Ok("İndirim başarıyla eklendi veya güncellendi.");
        }

        // 4. TinyHouseId’ye göre indirim sil
        [HttpDelete("tinyhouse/{tinyHouseId}")]
        public IActionResult DeleteDiscount(int tinyHouseId)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var query = "DELETE FROM discounts WHERE tiny_house_id = @TinyHouseId";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
                    int affected = cmd.ExecuteNonQuery();

                    if (affected == 0)
                        return NotFound("Bu Tiny House için silinecek indirim bulunamadı.");
                }
            }

            return Ok("İndirim başarıyla silindi.");
        }
    }
}
