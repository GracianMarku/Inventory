using Inventory.DTOs.CategoriesDTO;
using Inventory.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var category = await _categoryService.GetByIdAsync(id, ct);
            return Ok(category);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var data = await _categoryService.GetAllAsync(ct);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDTO dto, CancellationToken ct)
        {
            var created = await _categoryService.CreateAsync(dto, ct);
            return Ok(created);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDTO dto, CancellationToken ct)
        {
            var updated = await _categoryService.UpdateAsync(id, dto, ct);
            return Ok(updated);
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await _categoryService.DeleteAsync(id, ct);
            return NoContent();
        }

    }
}
