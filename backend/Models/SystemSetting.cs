using System;

namespace backend.Models
{
    public class SystemSetting
    {
        public int Id { get; set; }
        public string Category { get; set; } // General, Email, Notification, Reservation, Payment
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; } // String, Number, Boolean, JSON
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 