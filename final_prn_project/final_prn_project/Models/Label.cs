using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("Label")]
    public class Label
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Description { get; set; }

        public bool isDisplay { get; set; } = true;

        public bool isActive { get; set; } = true;
        public int groupID { get; set; }
        public virtual ICollection<GroupTaskLabel> GroupTaskLabels { get; set; }

        public Label()
        {
            this.GroupTaskLabels = new List<GroupTaskLabel>();
        }
    }

}
