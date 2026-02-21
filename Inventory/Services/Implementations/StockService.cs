using Inventory.DTOs.StockDTO;
using Inventory.DTOs.StockTransactionDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Inventory.Services.Interfaces;
using System.Runtime.Intrinsics.X86;
using System.Xml;

namespace Inventory.Services.Implementations
{
    public class StockService : IStockService
    {
        private readonly IUnitOfWork _uow;

        public StockService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task StockInAsync(StockInDTO dto, CancellationToken ct = default)
        {
            if (dto.Quantity <= 0)
            {
                throw new ArgumentException("Quantity must be greater than 0");
            }

                // Merr produktin(tracking) sepse do ta ndryshojmë StockQuantity
                var product = await _uow.Products.GetByIdForUpdateAsync(dto.ProductId, ct);
                if(product == null)
                {
                    throw new KeyNotFoundException("Product not found");
                }

            product.StockQuantity += dto.Quantity;

                // Nrysho stokun ne memorie
                var tx = new StockTransaction
                { 
                 ProductId = product.ProductId,
                 QuantityChange = dto.Quantity,  //IN = +quantity
                 Type = "IN",
                 Date = DateTime.UtcNow
                };

                await _uow.StockTransactions.AddAsync(tx, ct);

                // Ruaj gjithqka ne db
                await _uow.SaveChangesAsync(ct);

            
        }

        public async Task StockOutAsync(DTOs.StockDTO.StockOutDTO dto, CancellationToken ct = default)
        {
            if( dto.Quantity <= 0)
            {
                throw new ArgumentException("Quantity must be greater than 0");
            }

            // Merr produktin (tracking)
            var product = await _uow.Products.GetByIdForUpdateAsync(dto.ProductId, ct);
            if (product == null)
            {
                throw new KeyNotFoundException("Product not found");
            }

            // Rregulli kryesor i biznesit: mos lejo stok negativ
            if (product.StockQuantity < dto.Quantity)
            {
                throw new InvalidOperationException("Not enough stock");
            }

            // Ndrysho stokun ne memorie
            product.StockQuantity -= dto.Quantity;

            var tx = new StockTransaction
            {
                ProductId = product.ProductId,
                QuantityChange = -dto.Quantity, // OUT = -quantity
                Type = "OUT",
                Date = DateTime.UtcNow
            };

            await _uow.StockTransactions.AddAsync(tx, ct);

            await _uow.SaveChangesAsync(ct);

        }

        public async Task<List<CurrentStockItemDTO>> GetCurrentStockAsync(CancellationToken ct = default)
        {
            var products = await _uow.Products.GetAllForReadAsync(ct);
            return products
                .Select(p => new CurrentStockItemDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.Name,
                    StockQuantity = p.StockQuantity,
                })
                .ToList();
        }

        public async Task<CurrentStockItemDTO> GetCurrentStockByProductIdAsync(int productId, CancellationToken ct = default)
        {
            if(productId <= 0)
            {
                throw new ArgumentException("productId must be greater than 0");
            }

            var product = await _uow.Products.GetByIdForUpdateAsync(productId, ct);
            if(product == null)
            {
                throw new KeyNotFoundException("Product not found");
            }

            return new CurrentStockItemDTO
            {
                ProductId = product.ProductId,
                ProductName = product.Name,
                StockQuantity = product.StockQuantity,
            };
        }


    }
}
