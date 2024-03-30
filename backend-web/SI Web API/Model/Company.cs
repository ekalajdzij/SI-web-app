using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Model
{
    public class Company
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation property
        public ICollection<Admin> Admins { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<Campaign> Campaigns { get; set; }
    }
}
