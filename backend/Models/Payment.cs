using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("payments")]
    public class Payment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "ReservationId boş olamaz.")]
        [Column("reservation_id")]
        public int ReservationId { get; set; }

        [Required(ErrorMessage = "Tutar zorunludur.")]
        [Range(1, 100000, ErrorMessage = "Tutar 1 ile 100000 arasında olmalıdır.")]
        [Column("amount")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Ödeme yöntemi boş olamaz.")]
        [StringLength(50, ErrorMessage = "Ödeme yöntemi en fazla 50 karakter olmalıdır.")]
        [Column("payment_method")]
        public string PaymentMethod { get; set; }

        [Required(ErrorMessage = "Ödeme tarihi gereklidir.")]
        [Column("payment_date")]
        public DateTime PaymentDate { get; set; }

        [Required(ErrorMessage = "Ödeme durumu boş olamaz.")]
        [RegularExpression("^(Pending|Completed|Failed)$", ErrorMessage = "Geçerli bir ödeme durumu girin (Pending, Completed, Failed).")]
        [Column("payment_status")]
        public string PaymentStatus { get; set; }
    }
}
