using Inventory.DTOs.CategoriesDTO;

namespace Inventory.Services.Interfaces
{
    public interface ICategoryService 
    {
        Task<ReadCategoryDTO> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<ReadCategoryDTO>> GetAllAsync(CancellationToken ct = default);
        Task<ReadCategoryDTO> CreateAsync(CreateCategoryDTO dto, CancellationToken ct = default);

        Task<ReadCategoryDTO> UpdateAsync(int id, UpdateCategoryDTO dto, CancellationToken cancellationToken = default);

        Task DeleteAsync(int id, CancellationToken ct = default);
       
    }
}
