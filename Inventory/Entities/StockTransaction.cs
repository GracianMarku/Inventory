namespace Inventory.Entities
{
    public class StockTransaction
    {
        public int StockTransactionId { get; set; }
        public int ProductId { get; set; }
        public int QuantityChange { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }

        public Product Product { get; set; }
    }
}
