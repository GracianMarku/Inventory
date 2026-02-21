namespace Inventory.Entities
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        
        // Foreign Key
        public int CategoryId { get; set; }

        // Navigation Property
        public Category Category { get; set; }

        // Lidhja me transaksionet e stokut
        public ICollection<StockTransaction> StockTransactions { get; set; } 

        // Lidhja me SaleItem (shume produkte -> shume artikuj shitje) 
        public ICollection<SaleItem> SaleItems { get; set; } 



    }
}
