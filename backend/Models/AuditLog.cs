using System;

namespace backend.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; } // İşlemi yapan kullanıcı (opsiyonel)
        public string Action { get; set; } // Örn: Create, Update, Delete
        public string Entity { get; set; } // Örn: User, Reservation
        public int? EntityId { get; set; } // İlgili kaydın ID'si (opsiyonel)
        public string OldValue { get; set; } // JSON veya metin olarak eski değer
        public string NewValue { get; set; } // JSON veya metin olarak yeni değer
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
} 