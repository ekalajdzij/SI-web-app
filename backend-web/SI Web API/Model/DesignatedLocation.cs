using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Model
{
    public class DesignatedLocation
    {
        [Key]
        public int Tid { get; set; }
        public string RecordSerialNumber { get; set; }
        public string InventoryNumber { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
    }
}
