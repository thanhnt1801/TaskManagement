using final_prn_project.Models;
using System;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class UpdateTaskDTO
    {
        [JsonConstructor]
        public UpdateTaskDTO()
        {
        }

        public UpdateTaskDTO(Task task)
        {
            Name = task.Name;
            taskCreator = task.taskCreator;
            this.assignTo = task.assignTo;
            this.dueDate = task.dueDate;
            priorityID = task.priorityID;
            Description = task.Description;
            Attachment = task.Attachment;
            lastModifiedAt = task.lastModifiedAt;
            lastModifiedBy = task.lastModifiedBy;
        }

        public Guid taskCreator { get; set; }
        public string Name { get; set; }
        public Guid? assignTo { get; set; }
        public DateTime dueDate { get; set; }
        public int? priorityID { get; set; }
        public int? statusID { get; set; }
        public string Description { get; set; }
        public string Attachment { get; set; }
        public Guid lastModifiedBy { get; set; }
        public DateTime lastModifiedAt { get; set; }
    }
}
