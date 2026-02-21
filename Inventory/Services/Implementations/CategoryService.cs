using AutoMapper;
using Inventory.DTOs.CategoriesDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Inventory.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Inventory.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<ReadCategoryDTO> GetByIdAsync(int id, CancellationToken ct)
        {
            var category = await _uow.Categories.GetByIdAsync(id, ct);
            if(category == null)
            {
                throw new KeyNotFoundException($"Category with {id} not found");
            }

            return _mapper.Map<ReadCategoryDTO>(category);
        }

        public async Task<List<ReadCategoryDTO>> GetAllAsync(CancellationToken ct = default)
        {
            var categories = await _uow.Categories.GetAllAsync(ct);

            return _mapper.Map<List<ReadCategoryDTO>>(categories);

        }

        public async Task<ReadCategoryDTO> CreateAsync(CreateCategoryDTO dto, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Category name is required");
            }

            var exists = await _uow.Categories.ExistsByNameAsync(dto.Name.Trim(), excludeId: null, ct);
            if(exists)
            {
                throw new InvalidOperationException("Category name already exists");
            }

            var entity = _mapper.Map<Category>(dto);

            await _uow.Categories.AddAsync(entity, ct);

            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<ReadCategoryDTO>(entity);
        }

        public async Task<ReadCategoryDTO> UpdateAsync(int id, UpdateCategoryDTO dto, CancellationToken ct)
        {
            var category = await _uow.Categories.GetByIdAsync(id, ct);
            if(category == null)
            {
                throw new KeyNotFoundException($"Category with id {id} not found");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Category name is required");
            }

            var exists = await _uow.Categories.ExistsByNameAsync(dto.Name.Trim(), excludeId: null, ct);
            if(exists)
            {
                throw new InvalidOperationException("Category name already exists");
            }

            category.Name = dto.Name;

            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<ReadCategoryDTO>(category);
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            var category = await _uow.Categories.GetByIdAsync(id, ct);
            if(category == null)
            {
                throw new KeyNotFoundException($"Category with id {id} not found");
            }

            var hasProduct = await _uow.Categories.AnyByCategoryIdAsync(id, ct);
            
            if(hasProduct)
            {
                throw new InvalidOperationException("Cannot delete category because it has products");
            }
            
            _uow.Categories.Remove(category);
            await _uow.SaveChangesAsync(ct);
        }

    }
}
