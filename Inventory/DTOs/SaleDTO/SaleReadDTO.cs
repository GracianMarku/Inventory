namespace Inventory.DTOs.SaleDTO
{
    public class SaleReadDTO
    {
        public int SaleId { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalQuantity { get; set; }
    }
}
