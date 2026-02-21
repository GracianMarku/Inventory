using AutoMapper;
using Inventory.DTOs.StockTransactionDTO;
using Inventory.Entities;

namespace Inventory.Mapping
{
    public class StockTransactionProfile : Profile
    {
        public  StockTransactionProfile()
        {
            CreateMap<StockTransaction, ReadStockTransactionDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date));
        }


    }
}
