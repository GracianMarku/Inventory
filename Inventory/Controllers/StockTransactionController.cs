using Inventory.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockTransactionController : ControllerBase
    {
        private readonly IStockTransactionService _service;

        public StockTransactionController(IStockTransactionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var data = await _service.GetAllAsync(ct);
            return Ok(data);
        }

        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProductId([FromRoute] int productId, CancellationToken ct)
        {
            var data = await _service.GetByProductIdAsync(productId, ct);
            return Ok(data);
        }

    }
}
