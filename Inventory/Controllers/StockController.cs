using Inventory.DTOs.StockDTO;
using Inventory.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }


        [HttpPost("in")]
        public async Task<IActionResult> StockIn([FromBody] StockInDTO dto, CancellationToken ct)
        {
            await _stockService.StockInAsync(dto, ct);
            return Ok(new { message = "Stock added successfully" });
        }


        [HttpPost("out")]
        public async Task<IActionResult> StockOut([FromBody] StockOutDTO dto, CancellationToken ct)
        {
            await _stockService.StockOutAsync(dto, ct);
            return Ok(new { message = "Stock removed successfully" });
        }


        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentStock(CancellationToken ct)
        {
            var data = await _stockService.GetCurrentStockAsync(ct);
            return Ok(data);
        }

        [HttpGet("current/{productId:int}")]
        public async Task<IActionResult> GetCurrentStockByProductId([FromRoute] int productId, CancellationToken ct )
        {
            var data = await _stockService.GetCurrentStockByProductIdAsync(productId, ct);
            return Ok(data);
        }

    }
}
