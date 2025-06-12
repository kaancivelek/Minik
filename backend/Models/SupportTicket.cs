using System;

namespace backend.Models
{
    public class SupportTicket
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } // Open, InProgress, Resolved, Closed
        public string Priority { get; set; } // Low, Medium, High, Urgent
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? AssignedTo { get; set; } // Admin user ID who is assigned to this ticket
    }
} 