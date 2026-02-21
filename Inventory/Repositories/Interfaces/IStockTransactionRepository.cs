using Inventory.Entities;

namespace Inventory.Repositories.Interfaces
{
    public interface IStockTransactionRepository
    {
        Task<List<StockTransaction>> GetAllWithProductAsync(CancellationToken ct = default);
        Task<List<StockTransaction>> GetByProductIdAsync(int productId, CancellationToken ct  = default);

        Task AddAsync(StockTransaction entity, CancellationToken ct = default);
    }
}
