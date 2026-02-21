using Inventory.Common;
using Inventory.Data;
using Inventory.DTOs.SaleDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Repositories.Implementations
{
    public class SaleRepository : ISaleRepository
    {
        private readonly AppDbContext _db;
        public SaleRepository(AppDbContext db) => _db = db;

        //public async Task<List<Sale>> GetAllAsync(CancellationToken ct = default)
        //      => await _db.Sales.AsNoTracking().OrderByDescending(s => s.Date).ToListAsync(ct);

        public async Task<PagedResult<Sale>> GetPagedAsync(SaleQueryParams query, CancellationToken ct = default)
        {
            var page = query.Page < 1 ? 1 : query.Page;
            var pageSize = query.PageSize < 1 ? 10 : query.PageSize;
            if(pageSize > 100)
            {
                pageSize = 100;
            }

            IQueryable<Sale> q = _db.Sales.AsNoTracking();

            if(query.DateTo.HasValue)
            {
                q = q.Where(s => s.Date >= query.DateFrom.Value);
            }

            if(query.DateTo.HasValue)
            {
                q = q.Where(s => s.Date <= query.DateFrom.Value);
            }

            if(query.MinTotal.HasValue)
            {
                q = q.Where(s => s.TotalAmount >= query.MinTotal.Value);
            }

            if(query.MaxTotal.HasValue)
            {
                q = q.Where(s => s.TotalAmount <= query.MaxTotal.Value);
            }

            if(!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.Trim();
                if(int.TryParse(s, out var saleId))
                {
                    q = q.Where(x => x.SaleId == saleId);
                }
            }

            var totalCount = await q.CountAsync(ct);

            var skip = (page - 1) * pageSize;

            var items = await q
                .OrderByDescending(s => s.Date)
                .ThenByDescending(s => s.SaleId)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(ct);

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            return new PagedResult<Sale>
            { 
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };

        }



        public async Task<Sale?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _db.Sales.AsNoTracking().FirstOrDefaultAsync(s => s.SaleId == id, ct);

        public async Task<Sale?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default)
           => await _db.Sales
               .Include(s => s.SaleItems)
                   .ThenInclude(i => i.Product)
               .AsNoTracking()
               .FirstOrDefaultAsync(s => s.SaleId == id, ct);

        public async Task AddAsync(Sale entity, CancellationToken ct = default)
            => await _db.Sales.AddAsync(entity, ct);
    }
}
