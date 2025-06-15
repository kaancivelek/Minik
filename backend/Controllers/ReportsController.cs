using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/admin/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly string _connectionString;

        public ReportsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            int totalReservations = 0, totalUsers = 0, totalTinyHouses = 0;
            decimal totalIncome = 0;

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"
                SELECT 
                    (SELECT COUNT(*) FROM reservations) AS TotalReservations,
                    (SELECT SUM(total_price) FROM reservations) AS TotalIncome,
                    (SELECT COUNT(*) FROM users) AS TotalUsers,
                    (SELECT COUNT(*) FROM tiny_houses) AS TotalTinyHouses", conn);

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                totalReservations = reader.GetInt32(0);
                totalIncome = reader.IsDBNull(1) ? 0 : reader.GetDecimal(1);
                totalUsers = reader.GetInt32(2);
                totalTinyHouses = reader.GetInt32(3);
            }

            return Ok(new
            {
                totalReservations,
                totalIncome,
                totalUsers,
                totalTinyHouses
            });
        }

        [HttpGet("monthly-reservations")]
        public async Task<IActionResult> GetMonthlyReservations()
        {
            var list = new List<object>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"
                SELECT 
                    FORMAT(check_in, 'yyyy-MM') AS month, 
                    COUNT(*) AS count
                FROM reservations
                GROUP BY FORMAT(check_in, 'yyyy-MM')
                ORDER BY month", conn);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    month = reader.GetString(0),
                    count = reader.GetInt32(1)
                });
            }

            return Ok(list);
        }

        [HttpGet("top-tinyhouses")]
        public async Task<IActionResult> GetTopTinyHouses()
        {
            var list = new List<object>();

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var cmd = new SqlCommand(@"
                SELECT TOP 5 
                    th.name,
                    COUNT(r.id) AS reservationCount
                FROM reservations r
                JOIN tiny_houses th ON r.tiny_house_id = th.id
                GROUP BY th.name
                ORDER BY reservationCount DESC", conn);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    tinyHouseName = reader.GetString(0),
                    reservationCount = reader.GetInt32(1)
                });
            }

            return Ok(list);
        }

        [HttpGet("monthly-users")]
        public async Task<IActionResult> GetMonthlyUsers()
        {
            // CreatedAt verisi yoksa boş liste döner
            return Ok(new List<object>());
        }
    }
}
