using final_prn_project.Models;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class LabelDTO
    {
        [JsonConstructor]
        public LabelDTO()
        {
        }

        public LabelDTO(Label label)
        {
            ID = label.ID;
            Name = label.Name;
            Description = label.Description;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

    }
}
