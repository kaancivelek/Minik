using System;

namespace backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TinyHouseId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}

