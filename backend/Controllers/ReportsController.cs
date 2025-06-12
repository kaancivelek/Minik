using Microsoft.AspNetCore.Mvc;
using backend.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/admin/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var totalReservations = _context.Set<backend.Models.Reservation>().Count();
            var totalIncome = _context.Set<backend.Models.Reservation>().Sum(r => (decimal?)r.TotalPrice) ?? 0;
            var totalUsers = _context.Set<backend.Models.User>().Count();
            var totalTinyHouses = _context.TinyHouses.Count();

            var summary = new
            {
                totalReservations,
                totalIncome,
                totalUsers,
                totalTinyHouses
            };
            return Ok(summary);
        }

        [HttpGet("monthly-reservations")]
        public IActionResult GetMonthlyReservations()
        {
            var data = _context.Set<backend.Models.Reservation>()
                .GroupBy(r => new { r.CheckIn.Year, r.CheckIn.Month })
                .Select(g => new
                {
                    month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    count = g.Count()
                })
                .OrderBy(x => x.month)
                .ToList();
            return Ok(data);
        }

        [HttpGet("top-tinyhouses")]
        public IActionResult GetTopTinyHouses()
        {
            var data = _context.Set<backend.Models.Reservation>()
                .GroupBy(r => r.TinyHouseId)
                .Select(g => new
                {
                    tinyHouseId = g.Key,
                    reservationCount = g.Count()
                })
                .OrderByDescending(x => x.reservationCount)
                .Take(5)
                .ToList();

            // TinyHouse isimlerini ekle
            var result = data.Select(x => new
            {
                tinyHouseName = _context.TinyHouses.FirstOrDefault(t => t.Id == x.tinyHouseId)?.Name ?? $"TinyHouse #{x.tinyHouseId}",
                reservationCount = x.reservationCount
            });
            return Ok(result);
        }

        [HttpGet("monthly-users")]
        public IActionResult GetMonthlyUsers()
        {
            // Kullanıcı modelinde CreatedAt alanı yoksa, eklenmeli. Şimdilik Email üzerinden yıl/ay alınabilir.
            // Burada CreatedAt alanı olmadığı için örnek olarak Id üzerinden ayırmak mantıklı değil, gerçek projede CreatedAt eklenmeli.
            // Şimdilik boş veri dönelim.
            var data = new List<object>();
            return Ok(data);
        }
    }
} 