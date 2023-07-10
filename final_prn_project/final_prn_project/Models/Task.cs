using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace final_prn_project.Models
{
    [Table("Task")]
    public class Task
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("User")]
        [Required]
        public Guid taskCreator { get; set; }

        [ForeignKey("Status")]
        public int? statusID { get; set; }

        [ForeignKey("Priority")]
        public int? priorityID { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime createdAt { get; set; } = DateTime.Now;

        public Guid lastModifiedBy { get; set; }

        public DateTime lastModifiedAt { get; set; }

        public DateTime deletedAt { get; set; } = DateTime.Now;

        public Guid deletedBy { get; set; }
        public DateTime dueDate { get; set; }

        public Guid? assignTo { get; set; }

        public string Description { get; set; }

        public string Attachment { get; set; }

        [Required]
        public bool isActive { get; set; } = true;

        public bool isDelete { get; set; } = false;

        public virtual User User { get; set; }
        [JsonIgnore]
        public virtual Priority Priority { get; set; }
        [JsonIgnore]
        public virtual Status Status { get; set; }
        [JsonIgnore]
        public virtual ICollection<GroupTaskLabel> GroupTaskLabels { get; set; }

        public Task()
        {
            this.GroupTaskLabels = new List<GroupTaskLabel>();
        }
    }

}
