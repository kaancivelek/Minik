using Microsoft.EntityFrameworkCore;
using backend.Models;  // Modelleri burada import et

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSet tanımları burada olacak
        public DbSet<TinyHouse> TinyHouses { get; set; }
        public DbSet<HouseImages> HouseImages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

    }
}


















