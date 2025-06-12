using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using backend.Models;


[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public PaymentsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // 1. GET: Tüm ödemeleri getir
    [HttpGet]
    public IActionResult GetAllPayments()
    {
        var payments = new List<Payment>();
        string connectionString = _configuration.GetConnectionString("DefaultConnection");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = "SELECT * FROM payments";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        payments.Add(new Payment
                        {
                            Id = (int)reader["id"],
                            ReservationId = (int)reader["reservation_id"],
                            Amount = (decimal)reader["amount"],
                            PaymentMethod = reader["payment_method"].ToString(),
                            PaymentDate = (DateTime)reader["payment_date"],
                            PaymentStatus = reader["payment_status"].ToString()
                        });
                    }
                }
            }
        }
        return Ok(payments);
    }


    // 5. GET: Belirli bir rezervasyon ID'sine ait ödemeleri getir
    [HttpGet("reservation/{reservationId}")]
    public IActionResult GetPaymentsByReservationId(int reservationId)
    {
        var payments = new List<Payment>();
        string connectionString = _configuration.GetConnectionString("DefaultConnection");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = "SELECT * FROM payments WHERE reservation_id = @ReservationId";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ReservationId", reservationId);
                conn.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        payments.Add(new Payment
                        {
                            Id = (int)reader["id"],
                            ReservationId = (int)reader["reservation_id"],
                            Amount = (decimal)reader["amount"],
                            PaymentMethod = reader["payment_method"].ToString(),
                            PaymentDate = (DateTime)reader["payment_date"],
                            PaymentStatus = reader["payment_status"].ToString()
                        });
                    }
                }
            }
        }

        if (payments.Count == 0)
            return NotFound("Bu rezervasyon ID’sine ait ödeme bulunamadı.");

        return Ok(payments);
    }












    // 2. POST: Yeni ödeme ekle
    [HttpPost]
    public IActionResult AddPayment(Payment payment)
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = @"INSERT INTO payments (reservation_id, amount, payment_method, payment_date, payment_status)
                             VALUES (@ReservationId, @Amount, @PaymentMethod, @PaymentDate, @PaymentStatus)";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ReservationId", payment.ReservationId);
                cmd.Parameters.AddWithValue("@Amount", payment.Amount);
                cmd.Parameters.AddWithValue("@PaymentMethod", payment.PaymentMethod ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PaymentDate", payment.PaymentDate);
                cmd.Parameters.AddWithValue("@PaymentStatus", payment.PaymentStatus ?? (object)DBNull.Value);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
        return Ok("Ödeme başarıyla eklendi.");
    }

    // 3. PATCH: Ödeme güncelle (örneğin ödeme durumu)
    [HttpPatch("{id}")]
    public IActionResult UpdatePaymentStatus(int id, [FromBody] Payment payment)
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = @"UPDATE payments SET payment_status = @PaymentStatus WHERE id = @Id";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@PaymentStatus", payment.PaymentStatus ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected == 0) return NotFound("Ödeme bulunamadı.");
            }
        }
        return Ok("Ödeme durumu güncellendi.");
    }

    // 4. DELETE: Ödeme sil
    [HttpDelete("{id}")]
    public IActionResult DeletePayment(int id)
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection");

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            string query = @"DELETE FROM payments WHERE id = @Id";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected == 0) return NotFound("Ödeme bulunamadı.");
            }
        }
        return Ok("Ödeme silindi.");
    }
}
