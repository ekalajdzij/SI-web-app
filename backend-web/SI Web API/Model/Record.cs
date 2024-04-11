using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class Record
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }
        public string SerialNumber { get; set; }
        public string InventoryNumber { get; set; }
        public string GPSCoordinates { get; set; }
        public string FullAddress { get; set; }
        public string PhotoUrl { get; set; }
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("Location")]
        public int? LocationId { get; set; }
        [ForeignKey("User")]
        public int? UserId { get; set; }
    }
}
