namespace Inventory.DTOs.StockTransactionDTO
{
    public class ReadStockTransactionDTO
    {
        public int StockTransactionId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int QuantityChange { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
    }
}
