using Inventory.Data;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _db;
        public CategoryRepository(AppDbContext db) => _db = db;

        public async Task<List<Category>> GetAllAsync(CancellationToken ct = default)
            => await _db.Categories.AsNoTracking().ToListAsync(ct);

        public async Task<Category?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _db.Categories.FirstOrDefaultAsync(c => c.CategoryId == id, ct);

        public async Task AddAsync(Category enitity, CancellationToken ct = default)
            => await _db.Categories.AddAsync(enitity, ct);

        public void Update(Category entity) => _db.Categories.Update(entity);
        public void Remove(Category entity) => _db.Categories.Remove(entity);

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null, CancellationToken ct = default)
            => await _db.Categories.AnyAsync(c => 
                     c.Name == name && (!excludeId.HasValue || c.CategoryId != excludeId.Value), ct);

        public async Task<bool> AnyByCategoryIdAsync(int categoryId, CancellationToken ct = default)
        {
            return await _db.Products.AnyAsync(p => p.CategoryId == categoryId, ct);

        }

    }
}
