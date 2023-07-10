using final_prn_project.Models;
using Microsoft.EntityFrameworkCore;

namespace final_prn_project.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server=HOANGPHUC\\SQLEXPRESS;Trusted_Connection=true; Database=prn_project_final;");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Priority> Priorities { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<UserRoleGroup> UserRoleGroups { get; set; }


    }
}
