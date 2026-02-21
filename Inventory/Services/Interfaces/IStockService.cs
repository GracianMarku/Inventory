using Inventory.DTOs.StockDTO;
using Inventory.DTOs.StockTransactionDTO;

namespace Inventory.Services.Interfaces
{
    public interface IStockService
    {
        Task StockInAsync(StockInDTO dto, CancellationToken ct = default);
        Task StockOutAsync(StockOutDTO dto, CancellationToken ct = default);

        Task<List<CurrentStockItemDTO>> GetCurrentStockAsync(CancellationToken ct = default);
        Task<CurrentStockItemDTO> GetCurrentStockByProductIdAsync(int productId, CancellationToken ct = default);

    }
}
