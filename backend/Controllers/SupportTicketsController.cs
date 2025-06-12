using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using backend.Models;
using System;
using System.Collections.Generic;

namespace Minik.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportTicketsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SupportTicketsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/supporttickets
        [HttpGet]
        public IActionResult GetAllTickets()
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var tickets = new List<object>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"SELECT t.*, u.email as user_email, a.email as assigned_to_email 
                               FROM support_tickets t 
                               LEFT JOIN users u ON t.user_id = u.id 
                               LEFT JOIN users a ON t.assigned_to = a.id 
                               ORDER BY t.created_at DESC";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tickets.Add(new
                        {
                            Id = reader.GetInt32(0),
                            UserId = reader.GetInt32(1),
                            UserEmail = reader.IsDBNull(8) ? null : reader.GetString(8),
                            Subject = reader.GetString(2),
                            Description = reader.GetString(3),
                            Status = reader.GetString(4),
                            Priority = reader.GetString(5),
                            CreatedAt = reader.GetDateTime(6),
                            UpdatedAt = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7),
                            AssignedTo = reader.IsDBNull(9) ? null : (int?)reader.GetInt32(9),
                            AssignedToEmail = reader.IsDBNull(10) ? null : reader.GetString(10)
                        });
                    }
                }
            }
            return Ok(tickets);
        }

        // GET: api/supporttickets/{id}
        [HttpGet("{id}")]
        public IActionResult GetTicketById(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            object ticket = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"SELECT t.*, u.email as user_email, a.email as assigned_to_email 
                               FROM support_tickets t 
                               LEFT JOIN users u ON t.user_id = u.id 
                               LEFT JOIN users a ON t.assigned_to = a.id 
                               WHERE t.id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            ticket = new
                            {
                                Id = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                UserEmail = reader.IsDBNull(8) ? null : reader.GetString(8),
                                Subject = reader.GetString(2),
                                Description = reader.GetString(3),
                                Status = reader.GetString(4),
                                Priority = reader.GetString(5),
                                CreatedAt = reader.GetDateTime(6),
                                UpdatedAt = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7),
                                AssignedTo = reader.IsDBNull(9) ? null : (int?)reader.GetInt32(9),
                                AssignedToEmail = reader.IsDBNull(10) ? null : reader.GetString(10)
                            };
                        }
                    }
                }
            }

            if (ticket == null)
                return NotFound("Destek talebi bulunamadı.");

            return Ok(ticket);
        }

        // POST: api/supporttickets
        [HttpPost]
        public IActionResult CreateTicket([FromBody] SupportTicket ticket)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"INSERT INTO support_tickets 
                               (user_id, subject, description, status, priority, created_at) 
                               VALUES (@UserId, @Subject, @Description, @Status, @Priority, @CreatedAt)";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", ticket.UserId);
                    cmd.Parameters.AddWithValue("@Subject", ticket.Subject);
                    cmd.Parameters.AddWithValue("@Description", ticket.Description);
                    cmd.Parameters.AddWithValue("@Status", "Open");
                    cmd.Parameters.AddWithValue("@Priority", ticket.Priority);
                    cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok("Destek talebi başarıyla oluşturuldu.");
        }

        // PATCH: api/supporttickets/{id}
        [HttpPatch("{id}")]
        public IActionResult UpdateTicket(int id, [FromBody] SupportTicket update)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"UPDATE support_tickets 
                               SET status = @Status, 
                                   priority = @Priority, 
                                   assigned_to = @AssignedTo, 
                                   updated_at = @UpdatedAt 
                               WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Status", update.Status);
                    cmd.Parameters.AddWithValue("@Priority", update.Priority);
                    cmd.Parameters.AddWithValue("@AssignedTo", (object)update.AssignedTo ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Güncellenecek destek talebi bulunamadı.");
                }
            }
            return Ok("Destek talebi başarıyla güncellendi.");
        }

        // DELETE: api/supporttickets/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTicket(int id)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM support_tickets WHERE id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    int affected = cmd.ExecuteNonQuery();
                    if (affected == 0)
                        return NotFound("Silinecek destek talebi bulunamadı.");
                }
            }
            return Ok("Destek talebi başarıyla silindi.");
        }
    }
} 