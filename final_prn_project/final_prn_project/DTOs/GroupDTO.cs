using final_prn_project.Models;
using System;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class GroupDTO
    {
        public GroupDTO(Group group)
        {
            if (group.ID != 0) ID = group.ID;
            if (group.Name != null) Name = group.Name;
            if (group.userID != null) userID = group.userID;
            if (group.Description != null) Description = group.Description;
        }
        [JsonConstructor]
        public GroupDTO() { }

        public int ID { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid userID { get; set; }
    }
}
