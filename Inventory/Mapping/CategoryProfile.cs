using AutoMapper;
using Inventory.DTOs.CategoriesDTO;
using Inventory.Entities;

namespace Inventory.Mapping
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            // Entity -> Read DTO
            CreateMap<Category, ReadCategoryDTO>();

            // Create DTO -> Entity
            CreateMap<CreateCategoryDTO, Category>();

            // Update DTO -> Entity
            CreateMap<UpdateCategoryDTO, Category>();
        }
    }
}
