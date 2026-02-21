using AutoMapper;
using Inventory.DTOs.SaleDTO;
using Inventory.Entities;

namespace Inventory.Mapping
{
    public class SaleProfile : Profile
    {
        public SaleProfile()
        {
            // Sale -> SaleReadDTO (per listim)
            CreateMap<Sale, SaleReadDTO>()
                .ForMember(dest => dest.TotalQuantity,
                           opt => opt.MapFrom(src => src.SaleItems.Sum(i => i.Quantity)));

            // Sale -> SaleDetailsDTO (per invoice/details)
            CreateMap<Sale, SaleDetailsDTO>()
                .ForMember(dest => dest.TotalQuantity,
                           opt => opt.MapFrom(src => src.SaleItems.Sum(i => i.Quantity)))
                .ForMember(dest => dest.Items,
                           opt => opt.MapFrom(src => src.SaleItems));

            // SaleItem -> SaleItemDetailsDTO
            CreateMap<SaleItem, SaleItemDetailsDTO>()
                .ForMember(dest => dest.ProductName,
                            opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Subtotal,
                            opt => opt.MapFrom(src => src.Price * src.Quantity));
        }
    }
}
