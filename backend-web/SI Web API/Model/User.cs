using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SI_Web_API.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string Mail { get; set; }
        [NotMapped]
        public string Token { get; set; }
        public string Role { get; set; }
        public string SecretKey { get; set; }

    }
}
