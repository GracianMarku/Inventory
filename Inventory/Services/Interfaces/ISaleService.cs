using Inventory.Common;
using Inventory.DTOs.SaleDTO;

namespace Inventory.Services.Interfaces
{
    public interface ISaleService
    {
        Task<SaleDetailsDTO> CreateAsync(CreateSaleDTO dto, CancellationToken ct = default);
        Task<PagedResult<SaleReadDTO>> GetAllAsync(SaleQueryParams query, CancellationToken ct = default);
        Task<SaleDetailsDTO> GetDetailsAsync(int saleId, CancellationToken ct = default);
    }
}
