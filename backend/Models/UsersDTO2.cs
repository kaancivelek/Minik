namespace backend.Models
{
    public class Users2DTO
    {
       
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int? RoleId { get; set; }
        public string PhoneNumber { get; set; }
    }
}
