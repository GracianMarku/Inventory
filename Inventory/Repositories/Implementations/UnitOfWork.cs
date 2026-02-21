using Inventory.Data;
using Inventory.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace Inventory.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _db;

        public ICategoryRepository Categories { get; }
        public IProductRepository Products { get; }
        public ISaleRepository Sales { get; }
        public IStockTransactionRepository StockTransactions { get; }

        public UnitOfWork(
            AppDbContext db,
            ICategoryRepository categories,
            IProductRepository products,
            ISaleRepository sales,
            IStockTransactionRepository stockTransactions)
        {
            _db = db;
            Categories = categories;
            Products = products;
            Sales = sales;
            StockTransactions = stockTransactions;
        }

        public Task<int> SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);

        public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
        {
            return _db.Database.BeginTransactionAsync(ct);
        }
    }
}
