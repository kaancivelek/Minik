using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("tiny_houses")] // Veritabanı tablo ismi
    public class TinyHouse
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("location_id")]
        public int LocationId { get; set; }

        [Column("price_per_night")]
        [DataType(DataType.Currency)]
        public decimal PricePerNight { get; set; }

        [Column("max_guests")]
        public int MaxGuests { get; set; }

        [ForeignKey("Users")]
        [Column("property_owner_id")]
        public int property_owner_id { get; set; }

        [Column("amenities")]
        public string Amenities { get; set; }

        [Column("country")]
        public string Country { get; set; }

        [Column("City")]
        public string City { get; set; }

        [Column("Rating")]

        public int Rating { get; set; }

        

    }
}
