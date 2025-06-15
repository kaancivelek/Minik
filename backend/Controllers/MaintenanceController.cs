using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using backend.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Minik.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public MaintenanceController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllMaintenance()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Maintenance> maintenances = new();

            using SqlConnection conn = new(connectionString);
            conn.Open();
            string query = "SELECT * FROM maintenance";
            using SqlCommand cmd = new(query, conn);
            using SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Enum.TryParse(reader["status"].ToString(), true, out MaintenanceStatus status);
                maintenances.Add(new Maintenance
                {
                    Id = (int)reader["id"],
                    TinyHouseId = (int)reader["tiny_house_id"],
                    MaintenanceType = reader["maintenance_type"].ToString(),
                    MaintenanceDate = (DateTime)reader["maintenance_date"],
                    Status = status
                });
            }
            return Ok(maintenances);
        }

        [HttpGet("{id}")]
        public IActionResult GetMaintenanceById(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            Maintenance maintenance = null;

            using SqlConnection conn = new(connectionString);
            conn.Open();
            string query = "SELECT * FROM maintenance WHERE id = @Id";
            using SqlCommand cmd = new(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            using SqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                Enum.TryParse(reader["status"].ToString(), true, out MaintenanceStatus status);
                maintenance = new Maintenance
                {
                    Id = (int)reader["id"],
                    TinyHouseId = (int)reader["tiny_house_id"],
                    MaintenanceType = reader["maintenance_type"].ToString(),
                    MaintenanceDate = (DateTime)reader["maintenance_date"],
                    Status = status
                };
            }
            return maintenance == null ? NotFound("Bakım kaydı bulunamadı.") : Ok(maintenance);
        }

        [HttpPost]
        public IActionResult AddMaintenance([FromBody] Maintenance maintenance)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            int newMaintenanceId;

            using SqlConnection conn = new(connectionString);
            conn.Open();
            string query = @"INSERT INTO maintenance (tiny_house_id, maintenance_type, maintenance_date, status)
                            OUTPUT INSERTED.id VALUES (@TinyHouseId, @MaintenanceType, @MaintenanceDate, @Status)";
            using SqlCommand cmd = new(query, conn);
            cmd.Parameters.AddWithValue("@TinyHouseId", maintenance.TinyHouseId);
            cmd.Parameters.AddWithValue("@MaintenanceType", maintenance.MaintenanceType);
            cmd.Parameters.AddWithValue("@MaintenanceDate", maintenance.MaintenanceDate);
            cmd.Parameters.AddWithValue("@Status", maintenance.Status.ToString());
            newMaintenanceId = (int)cmd.ExecuteScalar();

            var log = new AuditLog
            {
                UserId = null,
                Action = "Create",
                Entity = "Maintenance",
                EntityId = newMaintenanceId,
                OldValue = null,
                NewValue = JsonSerializer.Serialize(new
                {
                    Id = newMaintenanceId,
                    maintenance.TinyHouseId,
                    maintenance.MaintenanceType,
                    maintenance.MaintenanceDate,
                    Status = maintenance.Status.ToString()
                }),
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();
            return Ok("Yeni bakım kaydı başarıyla eklendi.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMaintenance(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object deletedMaintenance = null;

            using (SqlConnection conn = new(connectionString))
            {
                conn.Open();
                string selectQuery = "SELECT * FROM maintenance WHERE id = @Id";
                using SqlCommand selectCmd = new(selectQuery, conn);
                selectCmd.Parameters.AddWithValue("@Id", id);
                using SqlDataReader reader = selectCmd.ExecuteReader();
                if (reader.Read())
                {
                    deletedMaintenance = new
                    {
                        Id = (int)reader["id"],
                        TinyHouseId = (int)reader["tiny_house_id"],
                        MaintenanceType = reader["maintenance_type"].ToString(),
                        MaintenanceDate = (DateTime)reader["maintenance_date"],
                        Status = reader["status"].ToString()
                    };
                }
                else return NotFound("Silinecek bakım kaydı bulunamadı.");
            }

            using (SqlConnection conn = new(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM maintenance WHERE id = @Id";
                using SqlCommand cmd = new(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                if (cmd.ExecuteNonQuery() == 0)
                    return NotFound("Silinecek bakım kaydı bulunamadı.");
            }

            var log = new AuditLog
            {
                UserId = null,
                Action = "Delete",
                Entity = "Maintenance",
                EntityId = id,
                OldValue = JsonSerializer.Serialize(deletedMaintenance),
                NewValue = null,
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();

            return Ok("Bakım kaydı başarıyla silindi.");
        }

        [HttpPatch("{id}")]
        public IActionResult UpdateMaintenance(int id, [FromBody] JsonElement updatedFields)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            Maintenance existing = null;

            using SqlConnection conn = new(connectionString);
            conn.Open();
            string selectQuery = "SELECT * FROM maintenance WHERE id = @Id";
            using SqlCommand selectCmd = new(selectQuery, conn);
            selectCmd.Parameters.AddWithValue("@Id", id);
            using SqlDataReader reader = selectCmd.ExecuteReader();
            if (reader.Read())
            {
                Enum.TryParse(reader["status"].ToString(), true, out MaintenanceStatus status);
                existing = new Maintenance
                {
                    Id = id,
                    TinyHouseId = (int)reader["tiny_house_id"],
                    MaintenanceType = reader["maintenance_type"].ToString(),
                    MaintenanceDate = (DateTime)reader["maintenance_date"],
                    Status = status
                };
            }
            else return NotFound("Bakım kaydı bulunamadı.");

            string newType = existing.MaintenanceType;
            DateTime newDate = existing.MaintenanceDate;
            MaintenanceStatus newStatus = existing.Status;

            if (updatedFields.TryGetProperty("maintenance_type", out var typeProp) && typeProp.ValueKind == JsonValueKind.String)
                newType = typeProp.GetString();

            if (updatedFields.TryGetProperty("maintenance_date", out var dateProp) && dateProp.ValueKind == JsonValueKind.String)
                if (!DateTime.TryParse(dateProp.GetString(), out newDate))
                    return BadRequest("Geçersiz tarih formatı.");

            if (updatedFields.TryGetProperty("status", out var statusProp) && statusProp.ValueKind == JsonValueKind.String)
                if (!Enum.TryParse(statusProp.GetString(), true, out newStatus))
                    return BadRequest("Geçersiz status değeri.");

            using (SqlConnection conn2 = new(connectionString))
            {
                conn2.Open();
                string updateQuery = @"UPDATE maintenance SET maintenance_type = @MaintenanceType, maintenance_date = @MaintenanceDate, status = @Status WHERE id = @Id";
                using SqlCommand updateCmd = new(updateQuery, conn2);
                updateCmd.Parameters.AddWithValue("@MaintenanceType", newType);
                updateCmd.Parameters.AddWithValue("@MaintenanceDate", newDate);
                updateCmd.Parameters.AddWithValue("@Status", newStatus.ToString());
                updateCmd.Parameters.AddWithValue("@Id", id);
                updateCmd.ExecuteNonQuery();
            }

            var updated = new Maintenance
            {
                Id = id,
                TinyHouseId = existing.TinyHouseId,
                MaintenanceType = newType,
                MaintenanceDate = newDate,
                Status = newStatus
            };

            var log = new AuditLog
            {
                UserId = null,
                Action = "Update",
                Entity = "Maintenance",
                EntityId = id,
                OldValue = JsonSerializer.Serialize(existing),
                NewValue = JsonSerializer.Serialize(updated),
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            _context.SaveChanges();

            return Ok("Bakım kaydı başarıyla güncellendi.");
        }

        [HttpGet("tinyhouse/{tinyHouseId}")]
        public IActionResult GetMaintenanceByTinyHouseId(int tinyHouseId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Maintenance> maintenances = new();

            using SqlConnection conn = new(connectionString);
            conn.Open();
            string query = "SELECT * FROM maintenance WHERE tiny_house_id = @TinyHouseId";
            using SqlCommand cmd = new(query, conn);
            cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);
            using SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Enum.TryParse(reader["status"].ToString(), true, out MaintenanceStatus status);
                maintenances.Add(new Maintenance
                {
                    Id = (int)reader["id"],
                    TinyHouseId = (int)reader["tiny_house_id"],
                    MaintenanceType = reader["maintenance_type"].ToString(),
                    MaintenanceDate = (DateTime)reader["maintenance_date"],
                    Status = status
                });
            }
            return maintenances.Count == 0 ? NotFound("Bu tiny house'a ait bakım kaydı bulunamadı.") : Ok(maintenances);
        }
    }
}
