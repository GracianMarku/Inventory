namespace Inventory.DTOs.SaleDTO
{
    public class SaleQueryParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string? Search {  get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        public decimal? MinTotal { get; set; }
        public decimal? MaxTotal { get; set; }


    }
}
