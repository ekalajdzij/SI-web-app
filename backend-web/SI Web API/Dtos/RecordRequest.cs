using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SI_Web_API.Dtos
{
    public class RecordRequest
    {
        [Required]
        public string SerialNumber { get; set; }

        [Required]
        public string InventoryNumber { get; set; }
        [Required]
        public string GPSCoordinates { get; set; }
        [Required]
        public string FullAddress { get; set; }
        [Required]
        public IFormFile Image { get; set; }
        public DateTime? CreatedAt { get; set; }

        [ForeignKey("Location")]
        public int? LocationId { get; set; }
        [ForeignKey("User")]
        public int? UserId { get; set; }
    }
}
