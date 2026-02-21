namespace Inventory.Entities
{
    public class Sale
    {
        public int SaleId { get; set; }
        public DateTime Date { get; set;} 
        public decimal TotalAmount { get; set;}

        public int TotalQuantity { get; set;}
        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
     }
}
