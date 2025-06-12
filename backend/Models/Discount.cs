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

        [ForeignKey("TinyHouse")]
        [Column("tiny_house_id")]
        public int TinyHouseId { get; set; }


        [Column("discount_percentage")]

        public int DiscountPercentage { get; set; }

        [Column("valid_from")]
        public DateTime ValidFrom { get; set; }
        [Column("valid_until")]
        public DateTime ValidUntil { get; set; }
        
           
        }
    }

