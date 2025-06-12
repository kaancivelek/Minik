using System;

namespace backend.Models
{
    public class Availability
    {
        public int Id { get; set; }
        public int TinyHouseId { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime AvailableTo { get; set; }
        public bool IsAvailable { get; set; }
    }
}
