using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly string _connectionString;

        public NotificationsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Bildirim ekle
        [HttpPost]
        public async Task<IActionResult> AddNotification([FromBody] Notification notification)
        {
            notification.CreatedAt = DateTime.UtcNow;
            notification.IsRead = false;

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                var cmd = new SqlCommand(@"
                    INSERT INTO notifications (user_id, title, message, is_read, created_at)
                    VALUES (@user_id, @title, @message, @is_read, @created_at);
                    SELECT SCOPE_IDENTITY();", conn);

                cmd.Parameters.AddWithValue("@user_id", notification.UserId);
                cmd.Parameters.AddWithValue("@title", notification.Title);
                cmd.Parameters.AddWithValue("@message", notification.Message);
                cmd.Parameters.AddWithValue("@is_read", notification.IsRead);
                cmd.Parameters.AddWithValue("@created_at", notification.CreatedAt);

                var result = await cmd.ExecuteScalarAsync();
                notification.Id = Convert.ToInt32(result);
            }

            return Ok(notification);
        }

        // Kullanıcıya ait bildirimleri getir
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = new List<Notification>();

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                var cmd = new SqlCommand(@"
                    SELECT id, user_id, title, message, created_at, is_read
                    FROM notifications
                    WHERE user_id = @userId
                    ORDER BY created_at DESC", conn);

                cmd.Parameters.AddWithValue("@userId", userId);

                var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    notifications.Add(new Notification
                    {
                        Id = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        Title = reader.GetString(2),
                        Message = reader.GetString(3),
                        CreatedAt = reader.GetDateTime(4),
                        IsRead = reader.GetBoolean(5)
                    });
                }
            }

            return Ok(notifications);
        }

        // Bildirimi okundu olarak işaretle
        [HttpPatch("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                var cmd = new SqlCommand(@"
                    UPDATE notifications
                    SET is_read = 1
                    WHERE id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                    return NotFound();
            }

            return Ok(new { message = "Bildirim okundu olarak işaretlendi." });
        }

        // Bildirim sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                var cmd = new SqlCommand(@"
                    DELETE FROM notifications
                    WHERE id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                    return NotFound();
            }

            return Ok(new { message = "Bildirim silindi." });
        }
    }
}
