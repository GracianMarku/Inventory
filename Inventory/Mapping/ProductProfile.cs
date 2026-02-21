using AutoMapper;
using Inventory.DTOs.ProductDTO;
using Inventory.Entities;

namespace Inventory.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile() {

            // Create DTO -> Entity
            CreateMap<CreateProductDTO, Product>();

            // Update DTO -> Entity
            CreateMap<UpdateProductDTO, Product>();

            // Entity -> Read DTO
            CreateMap<Product, ReadProductDTO>()
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src => src.Category.Name));

        }
    }
}
