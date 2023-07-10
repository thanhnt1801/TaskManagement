using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("GroupTaskLabel")]
    public class GroupTaskLabel
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("Group")]
        public int groupID { get; set; }

        [ForeignKey("Task")]
        public int taskID { get; set; }

        [ForeignKey("Label")]
        public int? labelID { get; set; }

        public virtual Group Group { get; set; }
        public virtual Task Task { get; set; }
        public virtual Label Label { get; set; }
    }
}
