using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("house_images")]
    public class HouseImages
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("TinyHouse")]
        [Column("tiny_house_id")]
        public int TinyHouseId { get; set; }
        [Column("image_url")]
        public string ImageUrl { get; set; }

    }
}
