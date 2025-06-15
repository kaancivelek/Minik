using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Discount")]
    public class Discount
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("TinyHouse")]
        [Column("tiny_house_id")]
        public int TinyHouseId { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "İndirim %1 ile %100 arasında olmalıdır.")]
        [Column("discount_percentage")]
        public int DiscountPercentage { get; set; }

        [Required]
        [Column("valid_from")]
        public DateTime ValidFrom { get; set; }

        [Required]
        [Column("valid_until")]
        public DateTime ValidUntil { get; set; }
    }
}
