using final_prn_project.Models;
using System;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class TaskDTO
    {
        [JsonConstructor]
        public TaskDTO()
        {
        }

        public TaskDTO(Task task)
        {
            ID = task.ID;
            Name = task.Name;
            taskCreator = task.taskCreator;
            this.assignTo = task.assignTo;
            this.dueDate = task.dueDate;
            priorityID = task.priorityID;
            Description = task.Description;
            Attachment = task.Attachment;
        }

        public int ID { get; set; }
        public Guid taskCreator { get; set; }
        public string Name { get; set; }
        public Guid? assignTo { get; set; }
        public DateTime dueDate { get; set; }
        public int? priorityID { get; set; }
        public string Description { get; set; }
        public string Attachment { get; set; }
    }
}
