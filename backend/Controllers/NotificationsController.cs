using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System;
using System.Linq;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Bildirim ekle
        [HttpPost]
        public IActionResult AddNotification([FromBody] Notification notification)
        {
            notification.CreatedAt = DateTime.UtcNow;
            _context.Notifications.Add(notification);
            _context.SaveChanges();
            return Ok(notification);
        }

        // Kullanıcıya ait bildirimleri getir
        [HttpGet("user/{userId}")]
        public IActionResult GetUserNotifications(int userId)
        {
            var notifications = _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
            return Ok(notifications);
        }

        // Bildirimi okundu olarak işaretle
        [HttpPatch("read/{id}")]
        public IActionResult MarkAsRead(int id)
        {
            var notification = _context.Notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
                return NotFound();
            notification.IsRead = true;
            _context.SaveChanges();
            return Ok(notification);
        }

        // Bildirim sil
        [HttpDelete("{id}")]
        public IActionResult DeleteNotification(int id)
        {
            var notification = _context.Notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
                return NotFound();
            _context.Notifications.Remove(notification);
            _context.SaveChanges();
            return Ok();
        }
    }
} 