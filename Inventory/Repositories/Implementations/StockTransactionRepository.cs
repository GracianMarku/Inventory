using Inventory.Data;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Repositories.Implementations
{
    public class StockTransactionRepository : IStockTransactionRepository
    {
        private readonly AppDbContext _db;
        public StockTransactionRepository(AppDbContext db) => _db = db;

        public async Task<List<StockTransaction>> GetAllWithProductAsync(CancellationToken ct = default)
            => await _db.StockTransactions
                .Include(t => t.Product)
                .AsNoTracking()
                .OrderByDescending(t => t.Date)
                .ToListAsync(ct);

        public async Task<List<StockTransaction>> GetByProductIdAsync(int productId, CancellationToken ct = default)
            => await _db.StockTransactions
                .Include(t => t.Product)
                .AsNoTracking()
                .Where(t => t.ProductId == productId)
                .OrderByDescending( t => t.Date )
                .ToListAsync(ct);

        public async Task AddAsync(StockTransaction entity, CancellationToken ct = default)
            => await _db.StockTransactions.AddAsync(entity, ct);
    }
}
