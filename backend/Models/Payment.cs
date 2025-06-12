public class Payment
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } // Örn: "Credit Card", "Paypal" vs.
    public DateTime PaymentDate { get; set; }
    public string PaymentStatus { get; set; } // Örn: "Pending", "Completed"
}
