using Inventory.Common;
using Inventory.DTOs.ProductDTO;

namespace Inventory.Services.Interfaces
{
    public interface IProductService
    {
        Task<ReadProductDTO> CreateAsync(CreateProductDTO dto, CancellationToken ct = default);
        Task<PagedResult<ReadProductDTO>> GetAllAsync(ProductQueryParams query, CancellationToken ct = default);

        Task<ReadProductDTO> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ReadProductDTO> UpdateAsync(int id, UpdateProductDTO dto, CancellationToken ct = default);
        Task DeleteAsync(int id, CancellationToken ct);

    }
}
