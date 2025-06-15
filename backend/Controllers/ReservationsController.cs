using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using backend.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.CodeAnalysis;
using System.ComponentModel.Design;
using System.Text.Json;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public ReservationsController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        // GET api/reservations/tinyhouse/5
        [HttpGet("tinyhouse/{tinyHouseId}")]
        public IActionResult GetReservationsByTinyHouseId(int tinyHouseId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Reservation> reservations = new List<Reservation>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM reservations WHERE tiny_house_id = @TinyHouseId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Reservation reservation = new Reservation
                            {
                                Id = (int)reader["id"],
                                UserId = (int)reader["user_id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                TotalPrice = (decimal)reader["total_price"],
                                Status = reader["status"].ToString(),
                                CheckIn = (DateTime)reader["check_in"],
                                CheckOut = (DateTime)reader["check_out"]
                            };

                            reservations.Add(reservation);
                        }
                    }
                }
            }

            if (reservations.Count == 0)
                return NotFound("Bu Tiny House'a ait rezervasyon bulunamadı.");

            return Ok(reservations);
        }

        // GET api/reservations/5
        [HttpGet("user/{userId}")]
        public IActionResult GetReservationsByUserId(int userId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Reservation> reservations = new List<Reservation>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // SQL Function çağrısı
                string query = "SELECT * FROM dbo.GetReservationsByUserIdFn(@UserId)";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Reservation reservation = new Reservation
                            {
                                UserId = (int)reader["user_id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                TotalPrice = (decimal)reader["total_price"],
                                Status = reader["status"].ToString(),
                                CheckIn = (DateTime)reader["check_in"],
                                CheckOut = (DateTime)reader["check_out"]
                            };

                            reservations.Add(reservation);
                        }
                    }
                }
            }

            if (reservations.Count == 0)
                return NotFound("Bu kullanıcıya ait rezervasyon bulunamadı.");

            return Ok(reservations);
        }

        // POST api/reservations
        [HttpPost]
        public IActionResult Post([FromBody] Reservation reservation)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            int newReservationId = 0;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = @"
INSERT INTO reservations 
(user_id, tiny_house_id, total_price, status, check_in, check_out)
OUTPUT INSERTED.id
VALUES 
(@UserId, @TinyHouseId, @TotalPrice, @Status, @CheckIn, @CheckOut)";

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@UserId", reservation.UserId);
                command.Parameters.AddWithValue("@TinyHouseId", reservation.TinyHouseId);
                command.Parameters.AddWithValue("@TotalPrice", reservation.TotalPrice);
                command.Parameters.AddWithValue("@Status", reservation.Status);
                command.Parameters.AddWithValue("@CheckIn", reservation.CheckIn);
                command.Parameters.AddWithValue("@CheckOut", reservation.CheckOut);

                connection.Open();
                newReservationId = (int)command.ExecuteScalar();
            }

            // Log ekle - Using injected DbContext
            var log = new backend.Models.AuditLog
            {
                UserId = null, // Giriş yapan adminin id'si eklenebilir
                Action = "Create",
                Entity = "Reservation",
                EntityId = newReservationId,
                OldValue = null,
                NewValue = JsonSerializer.Serialize(new {
                    Id = newReservationId,
                    reservation.UserId,
                    reservation.TinyHouseId,
                    reservation.TotalPrice,
                    reservation.Status,
                    reservation.CheckIn,
                    reservation.CheckOut
                }),
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();

            return Ok("Rezervasyon başarıyla eklendi.");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object deletedReservation = null;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                // Silinmeden önceki rezervasyonu al
                string selectQuery = "SELECT id, user_id, tiny_house_id, total_price, status, check_in, check_out FROM reservations WHERE id = @Id";
                using (SqlCommand selectCmd = new SqlCommand(selectQuery, connection))
                {
                    selectCmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = selectCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            deletedReservation = new
                            {
                                Id = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                TinyHouseId = reader.GetInt32(2),
                                TotalPrice = reader.GetDecimal(3),
                                Status = reader.GetString(4),
                                CheckIn = reader.GetDateTime(5),
                                CheckOut = reader.GetDateTime(6)
                            };
                        }
                        else
                        {
                            return NotFound("Rezervasyon bulunamadı.");
                        }
                    }
                }
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    // 1. Invoice'ları sil
                    string deleteInvoices = @"
                DELETE FROM invoices 
                WHERE payment_id IN (
                    SELECT id FROM payments WHERE reservation_id = @Id
                )";
                    using (SqlCommand cmd1 = new SqlCommand(deleteInvoices, connection, transaction))
                    {
                        cmd1.Parameters.AddWithValue("@Id", id);
                        cmd1.ExecuteNonQuery();
                    }

                    // 2. Payment'leri sil
                    string deletePayments = "DELETE FROM payments WHERE reservation_id = @Id";
                    using (SqlCommand cmd2 = new SqlCommand(deletePayments, connection, transaction))
                    {
                        cmd2.Parameters.AddWithValue("@Id", id);
                        cmd2.ExecuteNonQuery();
                    }

                    // 3. Reservation'ı sil
                    string deleteReservation = "DELETE FROM reservations WHERE id = @Id";
                    using (SqlCommand cmd3 = new SqlCommand(deleteReservation, connection, transaction))
                    {
                        cmd3.Parameters.AddWithValue("@Id", id);
                        int affected = cmd3.ExecuteNonQuery();

                        if (affected == 0)
                        {
                            transaction.Rollback();
                            return NotFound("Rezervasyon bulunamadı.");
                        }
                    }

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, "Hata oluştu: " + ex.Message);
                }
            }

            // Log ekle - Using injected DbContext
            var log = new backend.Models.AuditLog
            {
                UserId = null, // Giriş yapan adminin id'si eklenebilir
                Action = "Delete",
                Entity = "Reservation",
                EntityId = id,
                OldValue = System.Text.Json.JsonSerializer.Serialize(deletedReservation),
                NewValue = null,
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();

            return Ok("Tüm ilişkili kayıtlar başarıyla silindi.");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateReservation(int id, [FromBody] Reservation updatedReservation)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object oldReservation = null;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                // Güncellemeden önceki rezervasyonu al
                string selectQuery = "SELECT id, user_id, tiny_house_id, total_price, status, check_in, check_out FROM reservations WHERE id = @Id";
                using (SqlCommand selectCmd = new SqlCommand(selectQuery, connection))
                {
                    selectCmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = selectCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            oldReservation = new
                            {
                                Id = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                TinyHouseId = reader.GetInt32(2),
                                TotalPrice = reader.GetDecimal(3),
                                Status = reader.GetString(4),
                                CheckIn = reader.GetDateTime(5),
                                CheckOut = reader.GetDateTime(6)
                            };
                        }
                        else
                        {
                            return NotFound("Rezervasyon bulunamadı.");
                        }
                    }
                }
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = @"
                UPDATE reservations 
                SET  
                    tiny_house_id = @TinyHouseId, 
                    total_price = @TotalPrice, 
                    status = @Status,
                    check_in = @CheckIn,
                    check_out = @CheckOut
                WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@UserId", updatedReservation.UserId);
                    cmd.Parameters.AddWithValue("@TinyHouseId", updatedReservation.TinyHouseId);
                    cmd.Parameters.AddWithValue("@TotalPrice", updatedReservation.TotalPrice);
                    cmd.Parameters.AddWithValue("@Status", updatedReservation.Status ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@CheckIn", updatedReservation.CheckIn);
                    cmd.Parameters.AddWithValue("@CheckOut", updatedReservation.CheckOut);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int affectedRows = cmd.ExecuteNonQuery();
                    if (affectedRows == 0)
                        return NotFound("Rezervasyon bulunamadı.");
                }
            }

            // Güncellemeden sonraki rezervasyonu al
            object newReservation = null;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string selectQuery = "SELECT id, user_id, tiny_house_id, total_price, status, check_in, check_out FROM reservations WHERE id = @Id";
                using (SqlCommand selectCmd = new SqlCommand(selectQuery, connection))
                {
                    selectCmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = selectCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            newReservation = new
                            {
                                Id = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                TinyHouseId = reader.GetInt32(2),
                                TotalPrice = reader.GetDecimal(3),
                                Status = reader.GetString(4),
                                CheckIn = reader.GetDateTime(5),
                                CheckOut = reader.GetDateTime(6)
                            };
                        }
                    }
                }
            }

            // Log ekle - Using injected DbContext
            var log = new backend.Models.AuditLog
            {
                UserId = null, // Giriş yapan adminin id'si eklenebilir
                Action = "Update",
                Entity = "Reservation",
                EntityId = id,
                OldValue = System.Text.Json.JsonSerializer.Serialize(oldReservation),
                NewValue = System.Text.Json.JsonSerializer.Serialize(newReservation),
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();

            return Ok("Rezervasyon başarıyla güncellendi.");
        }

        [HttpPatch("updatestatus/{id}")]
        public IActionResult UpdateStatus(int id, [FromBody] string newStatus)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string query = "UPDATE reservations SET status = @status WHERE id = @id";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@status", newStatus);
                    command.Parameters.AddWithValue("@id", id);

                    int affected = command.ExecuteNonQuery();

                    if (affected == 0)
                        return NotFound("Rezervasyon bulunamadı.");

                    return Ok("Rezervasyon durumu güncellendi.");
                }
            }
        }

        [HttpGet("all")]
        public IActionResult GetAllReservations()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<object> reservations = new List<object>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"
                    SELECT r.id, r.user_id, r.tiny_house_id, r.total_price, r.status, r.check_in, r.check_out,
                           u.full_name AS user_name,
                           t.name AS house_name
                    FROM reservations r
                    LEFT JOIN users u ON r.user_id = u.id
                    LEFT JOIN tiny_houses t ON r.tiny_house_id = t.id
                ";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        reservations.Add(new
                        {
                            Id = reader.GetInt32(0),
                            UserId = reader.GetInt32(1),
                            TinyHouseId = reader.GetInt32(2),
                            TotalPrice = reader.GetDecimal(3),
                            Status = reader.GetString(4),
                            CheckIn = reader.GetDateTime(5),
                            CheckOut = reader.GetDateTime(6),
                            UserName = reader.IsDBNull(7) ? null : reader.GetString(7),
                            HouseName = reader.IsDBNull(8) ? null : reader.GetString(8)
                        });
                    }
                }
            }

            return Ok(reservations);
        }
    }
}