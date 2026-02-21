using AutoMapper;
using Inventory.Common;
using Inventory.DTOs.ProductDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Inventory.Services.Interfaces;

namespace Inventory.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public ProductService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<ReadProductDTO> CreateAsync(CreateProductDTO dto, CancellationToken ct = default)
        {
            if(string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Product name is required");
            }

            if(dto.CategoryId <= 0)
            {
                throw new ArgumentException("CategoryId is required");
            }

            var category = await _uow.Categories.GetByIdAsync(dto.CategoryId, ct);
            if(category == null)
            {
                throw new KeyNotFoundException("Category not found");
            }

            var initalStock = dto.StockQuantity;
            if(initalStock < 0)
            {
                throw new ArgumentException("StockQuantity cannot be negative");
            }

            var exists = await _uow.Products.ExistsByNameInCategoryAsync(dto.Name.Trim(), dto.CategoryId, excludeId: null, ct);
            if(exists)
            {
                throw new InvalidOperationException("Product with his name already exists in this category");
            }

            var entity = _mapper.Map<Product>(dto);

            entity.StockQuantity = initalStock;

            await _uow.Products.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);


            var created = await _uow.Products.GetByIdWithCategoryAsync(entity.ProductId, ct);
            if(created == null)
            {
                throw new Exception("Unexcepted error: create product not found");
            }
            return _mapper.Map<ReadProductDTO>(created);
        }

       public async Task<PagedResult<ReadProductDTO>> GetAllAsync(ProductQueryParams query, CancellationToken ct = default)
        {
            var paged = await _uow.Products.GetPagedWithCategoryAsync(query, ct);

            return new PagedResult<ReadProductDTO>

            { 
                Items = _mapper.Map<List<ReadProductDTO>>(paged.Items),
                Page = paged.Page,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount,
                TotalPages = paged.TotalPages
            };

        }

        public async Task<ReadProductDTO> GetByIdAsync(int id, CancellationToken ct)
        {
            var product = await _uow.Products.GetByIdForUpdateAsync(id, ct);
            if(product is null)
            {
                throw new KeyNotFoundException($"Product with id {id} not found");
            }

            return _mapper.Map<ReadProductDTO>(product);
        }

        public async Task<ReadProductDTO> UpdateAsync(int id, UpdateProductDTO dto, CancellationToken ct)
        {
            var product = await _uow.Products.GetByIdForUpdateAsync(id, ct);
            if(product is null )
            {
                throw new KeyNotFoundException($"Product with id {id} not found");
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.CategoryId = dto.CategoryId;
            product.Price = dto.Price;

            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<ReadProductDTO>(product);
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            var product = await _uow.Products.GetByIdForUpdateAsync(id, ct);
            if (product is null)
            {
                throw new KeyNotFoundException($"Product with id {id} not found");
            }

                _uow.Products.Remove(product);
                await _uow.SaveChangesAsync(ct);
            
        }
    }
}
