using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("Priority")]
    public class Priority
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public bool isActive { get; set; } = true;

        public ICollection<Task> Tasks { get; set; }
    }

}
