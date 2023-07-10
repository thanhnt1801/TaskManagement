using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("Status")]
    public class Status
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public double Percentage { get; set; }

        public bool isActive { get; set; } = true;

        public virtual Task Task { get; set; }
    }

}
