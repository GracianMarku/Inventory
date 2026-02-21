namespace Inventory.DTOs.StockTransactionDTO
{
    public class CurrentStockItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int StockQuantity { get; set; }
    }
}
