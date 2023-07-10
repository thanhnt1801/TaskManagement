using final_prn_project.Models;
using System;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class ProfileDTO
    {
        [JsonConstructor]
        public ProfileDTO()
        {
        }

        public ProfileDTO(User user)
        {
            ID = user.Id;
            Name = user.userName;
            Gender = user.Gender;
            Address = user.Address;
            Description = user.Description;
        }

        public Guid ID { get; set; }
        public string Name { get; set; }
        public string? Gender { get; set; } = "Not Specified";
        public string? Address { get; set; } = "";
        public string? Description { get; set; } = "";
    }
}
