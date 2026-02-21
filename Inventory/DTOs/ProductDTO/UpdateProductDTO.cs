namespace Inventory.DTOs.ProductDTO
{
    public class UpdateProductDTO
    {
        //public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        //public int StockQuantity { get; set; }
    }
}
