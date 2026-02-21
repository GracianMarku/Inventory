using Inventory.Common;
using Inventory.DTOs.ProductDTO;
using Inventory.Entities;

namespace Inventory.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllWithCategoryAsync(CancellationToken ct = default);
        Task<Product?> GetByIdWithCategoryAsync(int id, CancellationToken ct = default);

        // Trancing per StockIn/StockOut/CreateSale
        Task<Product?> GetByIdForUpdateAsync(int id, CancellationToken ct = default);

        Task<PagedResult<Product>> GetPagedWithCategoryAsync(ProductQueryParams query, CancellationToken ct = default);

        Task AddAsync(Product entity, CancellationToken ct = default);
        void Update(Product entity);
        void Remove(Product entity);

        Task<bool> ExistsByNameInCategoryAsync(string name, int categoryId, int? excludeId = null, CancellationToken ct = default);

        Task<List<Product>> GetAllForReadAsync(CancellationToken ct = default);
    }
}
