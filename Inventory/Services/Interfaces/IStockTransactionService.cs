using Inventory.DTOs.StockTransactionDTO;

namespace Inventory.Services.Interfaces
{
    public interface IStockTransactionService
    {
        Task<List<ReadStockTransactionDTO>> GetAllAsync(CancellationToken ct = default);
        Task<List<ReadStockTransactionDTO>> GetByProductIdAsync(int productId, CancellationToken ct = default);

    }
}
