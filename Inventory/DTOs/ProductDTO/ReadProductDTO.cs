namespace Inventory.DTOs.ProductDTO
{
    public class ReadProductDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string CategoryName { get; set; }
    }
}
