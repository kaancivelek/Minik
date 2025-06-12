using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System;
using System.Linq;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditLogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuditLogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Log ekle
        [HttpPost]
        public IActionResult AddLog([FromBody] AuditLog log)
        {
            log.Timestamp = DateTime.UtcNow;
            _context.AuditLogs.Add(log);
            _context.SaveChanges();
            return Ok(log);
        }

        // Tüm logları getir
        [HttpGet]
        public IActionResult GetLogs()
        {
            var logs = _context.AuditLogs.OrderByDescending(l => l.Timestamp).ToList();
            return Ok(logs);
        }
    }
} 