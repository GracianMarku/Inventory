namespace Inventory.DTOs.SaleDTO
{
    public class CreateSaleDTO
    {
        public List<CreateSaleItemDTO> Items { get; set; } = new();
    }

}
