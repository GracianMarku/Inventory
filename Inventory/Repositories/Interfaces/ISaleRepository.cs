using Inventory.Common;
using Inventory.DTOs.SaleDTO;
using Inventory.Entities;

namespace Inventory.Repositories.Interfaces
{
    public interface ISaleRepository
    {
        
        Task<Sale?> GetByIdAsync(int id,  CancellationToken ct = default);

        // Per Invoice/Details: Sale + Items + Product
        Task<Sale?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default);
        Task AddAsync(Sale entity, CancellationToken ct = default);

        Task<PagedResult<Sale>> GetPagedAsync(SaleQueryParams query, CancellationToken ct = default);
    }
}
