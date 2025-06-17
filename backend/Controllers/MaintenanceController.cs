using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
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

        // 1. GET: api/maintenance
        [HttpGet]
        public IActionResult GetAllMaintenance()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Maintenance> maintenances = new List<Maintenance>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM maintenance";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        maintenances.Add(new Maintenance
                        {
                            Id = (int)reader["id"],
                            TinyHouseId = (int)reader["tiny_house_id"],
                            MaintenanceType = reader["maintenance_type"].ToString(),
                            MaintenanceDate = (DateTime)reader["maintenance_date"],
                            Status = Enum.Parse<MaintenanceStatus>(reader["status"].ToString(), true)
                        });
                    }
                }
            }

            return Ok(maintenances);
        }

        // 2. GET: api/maintenance/{id}
        [HttpGet("{id}")]
        public IActionResult GetMaintenanceById(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            Maintenance maintenance = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM maintenance WHERE id = @Id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            maintenance = new Maintenance
                            {
                                Id = (int)reader["id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                MaintenanceType = reader["maintenance_type"].ToString(),
                                MaintenanceDate = (DateTime)reader["maintenance_date"],
                                Status = Enum.Parse<MaintenanceStatus>(reader["status"].ToString())
                            };
                        }
                    }
                }
            }

            if (maintenance == null)
                return NotFound("Bakım kaydı bulunamadı.");

            return Ok(maintenance);
        }

        // 3. POST: api/maintenance
        [HttpPost]
        public IActionResult AddMaintenance([FromBody] Maintenance maintenance)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                int newMaintenanceId = 0;
                
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = @"
                        INSERT INTO maintenance (tiny_house_id, maintenance_type, maintenance_date, status)
                        OUTPUT INSERTED.id
                        VALUES (@TinyHouseId, @MaintenanceType, @MaintenanceDate, @Status)";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@TinyHouseId", maintenance.TinyHouseId);
                        cmd.Parameters.AddWithValue("@MaintenanceType", maintenance.MaintenanceType);
                        cmd.Parameters.AddWithValue("@MaintenanceDate", maintenance.MaintenanceDate);
                        cmd.Parameters.AddWithValue("@Status", maintenance.Status.ToString());

                        newMaintenanceId = (int)cmd.ExecuteScalar();
                    }
                }

                // Log ekle - Dependency Injection ile gelen context'i kullan
                try
                {
                    var log = new AuditLog
                    {
                        UserId = null, // Giriş yapan adminin id'si eklenebilir
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
                }
                catch (Exception logEx)
                {
                    // Log hatası kayıt işlemini engellemesin, sadece console'a yaz
                    Console.WriteLine($"Log kaydı sırasında hata: {logEx.Message}");
                }

                return Ok(new { message = "Yeni bakım kaydı başarıyla eklendi.", id = newMaintenanceId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bakım kaydı eklenirken hata oluştu: {ex.Message}");
            }
        }

        // 4. DELETE: api/maintenance/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteMaintenance(int id)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                object deletedMaintenance = null;
                
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    // Silinmeden önceki bakım kaydını al
                    string selectQuery = "SELECT * FROM maintenance WHERE id = @Id";
                    using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                    {
                        selectCmd.Parameters.AddWithValue("@Id", id);
                        using (SqlDataReader reader = selectCmd.ExecuteReader())
                        {
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
                            else
                            {
                                return NotFound("Silinecek bakım kaydı bulunamadı.");
                            }
                        }
                    }
                }

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string query = "DELETE FROM maintenance WHERE id = @Id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        int affected = cmd.ExecuteNonQuery();

                        if (affected == 0)
                            return NotFound("Silinecek bakım kaydı bulunamadı.");
                    }
                }

                // Log ekle
                try
                {
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
                }
                catch (Exception logEx)
                {
                    Console.WriteLine($"Log kaydı sırasında hata: {logEx.Message}");
                }

                return Ok("Bakım kaydı başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bakım kaydı silinirken hata oluştu: {ex.Message}");
            }
        }

        // 5. PATCH: api/maintenance/{id}
        [HttpPatch("{id}")]
        public IActionResult UpdateMaintenance(int id, [FromBody] JsonElement updatedFields)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                Maintenance existing = null;
                
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string selectQuery = "SELECT * FROM maintenance WHERE id = @Id";
                    using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                    {
                        selectCmd.Parameters.AddWithValue("@Id", id);
                        using (var reader = selectCmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                existing = new Maintenance
                                {
                                    Id = id,
                                    TinyHouseId = (int)reader["tiny_house_id"],
                                    MaintenanceType = reader["maintenance_type"].ToString(),
                                    MaintenanceDate = (DateTime)reader["maintenance_date"],
                                    Status = Enum.Parse<MaintenanceStatus>(reader["status"].ToString())
                                };
                            }
                            else
                            {
                                return NotFound("Bakım kaydı bulunamadı.");
                            }
                        }
                    }
                }

                string newType = existing.MaintenanceType;
                DateTime newDate = existing.MaintenanceDate;
                MaintenanceStatus newStatus = existing.Status;

                if (updatedFields.TryGetProperty("maintenance_type", out var typeProp))
                    newType = typeProp.GetString();

                if (updatedFields.TryGetProperty("maintenance_date", out var dateProp))
                    newDate = dateProp.GetDateTime();

                if (updatedFields.TryGetProperty("status", out var statusProp))
                    newStatus = Enum.Parse<MaintenanceStatus>(statusProp.GetString());

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string updateQuery = @"
                        UPDATE maintenance
                        SET maintenance_type = @MaintenanceType,
                            maintenance_date = @MaintenanceDate,
                            status = @Status
                        WHERE id = @Id";

                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                    {
                        updateCmd.Parameters.AddWithValue("@MaintenanceType", newType);
                        updateCmd.Parameters.AddWithValue("@MaintenanceDate", newDate);
                        updateCmd.Parameters.AddWithValue("@Status", newStatus.ToString());
                        updateCmd.Parameters.AddWithValue("@Id", id);

                        updateCmd.ExecuteNonQuery();
                    }
                }

                // Güncellemeden sonraki bakım kaydını al
                Maintenance updated = new Maintenance
                {
                    Id = id,
                    TinyHouseId = existing.TinyHouseId,
                    MaintenanceType = newType,
                    MaintenanceDate = newDate,
                    Status = newStatus
                };

                // Log ekle
                try
                {
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
                }
                catch (Exception logEx)
                {
                    Console.WriteLine($"Log kaydı sırasında hata: {logEx.Message}");
                }

                return Ok("Bakım kaydı başarıyla güncellendi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bakım kaydı güncellenirken hata oluştu: {ex.Message}");
            }
        }

        // 6. GET: api/maintenance/tinyhouse/{tinyHouseId}
        [HttpGet("tinyhouse/{tinyHouseId}")]
        public IActionResult GetMaintenanceByTinyHouseId(int tinyHouseId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            List<Maintenance> maintenances = new List<Maintenance>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM maintenance WHERE tiny_house_id = @TinyHouseId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TinyHouseId", tinyHouseId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            maintenances.Add(new Maintenance
                            {
                                Id = (int)reader["id"],
                                TinyHouseId = (int)reader["tiny_house_id"],
                                MaintenanceType = reader["maintenance_type"].ToString(),
                                MaintenanceDate = (DateTime)reader["maintenance_date"],
                                Status = Enum.Parse<MaintenanceStatus>(reader["status"].ToString())
                            });
                        }
                    }
                }
            }

            return Ok(maintenances);
        }
    }
}