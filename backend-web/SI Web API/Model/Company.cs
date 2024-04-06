using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class Company
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation property
        [JsonIgnore]
        public ICollection<Admin> Admins { get; set; }
        [JsonIgnore]
        public ICollection<User> Users { get; set; }
        [JsonIgnore]
        public ICollection<Campaign> Campaigns { get; set; }
    }
}
