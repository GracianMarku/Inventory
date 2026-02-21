using Inventory.DTOs.ProductDTO;
using Inventory.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDTO dto, CancellationToken ct)
        {
            var created = await _productService.CreateAsync(dto, ct);
            return Ok(created);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ProductQueryParams query, CancellationToken ct)
        {
            var data = await _productService.GetAllAsync(query, ct);
            return Ok(data);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var product = await _productService.GetByIdAsync(id, ct);
            return Ok(product);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDTO dto, CancellationToken ct)
        {
            var updated = await _productService.UpdateAsync(id, dto, ct);
            return Ok(updated);
        }
        


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await _productService.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
