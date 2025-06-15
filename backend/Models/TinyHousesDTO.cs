namespace backend.Models
{
    public class TinyHousesDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int LocationId { get; set; }
        public decimal PricePerNight { get; set; }
        public int MaxGuests { get; set; }
        public int PropertyOwnerId { get; set; }
        public string Amenities { get; set; }

       
    }
}
