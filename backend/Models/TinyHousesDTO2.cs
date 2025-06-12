namespace backend.Models
{

    public class TinyHousesDTO2
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }

        public string? Country { get; set; } 
        public decimal? PricePerNight { get; set; }
        public int? MaxGuests { get; set; }
        public int? PropertyOwnerId { get; set; }
        public string? Amenities { get; set; }
    }
}