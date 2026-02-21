namespace Inventory.DTOs.ProductDTO
{
    public class CreateProductDTO
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
    
    }
}
