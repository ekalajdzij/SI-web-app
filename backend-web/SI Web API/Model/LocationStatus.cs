using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class LocationStatus
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        [ForeignKey("Location")]
        public int? LocationId { get; set; }
        public string? Status{ get; set; }
    }
}
