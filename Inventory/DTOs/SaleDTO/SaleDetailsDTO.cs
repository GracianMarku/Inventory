using System;

public class SaleDetailsDTO
{
	public int SaleId { get; set; }
	public DateTime Date { get; set; }
	public decimal TotalAmount { get; set; }
	public int TotalQuantity { get; set; }
	public List<SaleItemDetailsDTO> Items { get; set; } = new();
}
