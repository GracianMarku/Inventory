using Inventory.Entities;
using Microsoft.EntityFrameworkCore;
namespace Inventory.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Category> Categories { get; set;}
        public DbSet<Product> Products { get;   set;}

        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set;}
       
    }
}
