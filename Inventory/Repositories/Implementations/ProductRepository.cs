using Inventory.Common;
using Inventory.Data;
using Inventory.DTOs.ProductDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;
        public ProductRepository(AppDbContext db)
        {
            _db = db;
        }


        public async Task<List<Product>> GetAllWithCategoryAsync(CancellationToken ct = default)
            => await _db.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .ToListAsync(ct);

        public async Task<Product?> GetByIdWithCategoryAsync(int id, CancellationToken ct = default)
            => await _db.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == id, ct);

        public async Task<Product?> GetByIdForUpdateAsync(int id, CancellationToken ct = default)
            => await _db.Products
                .FirstOrDefaultAsync(p => p.ProductId == id, ct);


        public async Task AddAsync(Product entity, CancellationToken ct = default)  
           => await _db.Products.AddAsync(entity, ct);
       

        public void Update(Product entity) => _db.Products.Update(entity);
        public void Remove(Product entity) => _db.Products.Remove(entity);

        public async Task<bool> ExistsByNameInCategoryAsync(string name, int categoryId, int? excludeId = null, CancellationToken ct = default)
            => await _db.Products.AnyAsync(p =>
            p.Name == name && p.CategoryId == categoryId && (!excludeId.HasValue || p.ProductId != excludeId.Value), ct);


        public async Task<PagedResult<Product>> GetPagedWithCategoryAsync(ProductQueryParams query, CancellationToken ct = default)
        {
            // Santizimi i faqeve
            var page = query.Page < 1 ? 1 : query.Page;
            var pageSize = query.PageSize < 1 ? 10 : query.PageSize;

            if(pageSize > 100)
            {
                pageSize = 100;
            }

            IQueryable<Product> q = _db.Products
                .Include(p => p.Category)
                .AsNoTracking();

            if (query.CategoryId.HasValue)
            {
                q = q.Where(p => p.CategoryId == query.CategoryId.Value);
            }

            if(!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.Trim();
                q = q.Where(p => p.Name.Contains(s) || (p.Description != null && p.Description.Contains(s)));
            }

            var totalCount = await q.CountAsync(ct);

            var skip = (page - 1) * pageSize;

            var items = await q
                .OrderBy(p => p.ProductId)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(ct);

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            return new PagedResult<Product>
            { 
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };

        }

        public async Task<List<Product>> GetAllForReadAsync(CancellationToken ct = default)
        {
            return await _db.Products
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .ToListAsync(ct);
        }

    }
}

