using Inventory.Entities;

namespace Inventory.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync(CancellationToken ct = default);
        Task<Category?> GetByIdAsync(int id, CancellationToken ct = default);
        Task AddAsync(Category entity, CancellationToken ct = default);
        void Update(Category entity);
        void Remove(Category entity);

        Task<bool> AnyByCategoryIdAsync(int categoryId, CancellationToken ct = default);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null, CancellationToken ct = default);
    }
}
