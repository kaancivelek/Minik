namespace backend.Models { 
public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public int? RoleId { get; set; }
    public string PhoneNumber { get; set; }
}

}