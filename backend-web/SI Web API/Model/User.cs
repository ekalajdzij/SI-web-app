using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Mail { get; set; }
        public string Token { get; set; }

    }
}
