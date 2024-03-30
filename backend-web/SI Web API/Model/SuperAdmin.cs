using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Model
{
    public class SuperAdmin
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string SecretKey { get; set; }
    }
}
