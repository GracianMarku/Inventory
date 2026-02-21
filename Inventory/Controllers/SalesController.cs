using Inventory.DTOs.SaleDTO;
using Inventory.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SalesController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSaleDTO dto, CancellationToken ct)
        {
            var invoice = await _saleService.CreateAsync(dto, ct);
            return Ok(invoice);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SaleQueryParams query, CancellationToken ct)
        {
            var data = await _saleService.GetAllAsync(query, ct);
            return Ok(data);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDetails([FromRoute] int id, CancellationToken ct)
        {
            var data = await _saleService.GetDetailsAsync(id, ct);
            return Ok(data);
        }
    }
}



