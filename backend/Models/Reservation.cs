using System;

namespace backend.Models
{
    public class Reservation
    {
      
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TinyHouseId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
    }
}

