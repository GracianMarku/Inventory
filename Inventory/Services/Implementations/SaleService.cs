using AutoMapper;
using Inventory.Common;
using Inventory.DTOs.SaleDTO;
using Inventory.Entities;
using Inventory.Repositories.Interfaces;
using Inventory.Services.Interfaces;
using System.Linq.Expressions;

namespace Inventory.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public SaleService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<SaleDetailsDTO> CreateAsync(CreateSaleDTO dto, CancellationToken ct = default)
        {
            if (dto.Items == null || dto.Items.Count == 0)
            {
                throw new ArgumentException("Sale must have at least one item");
            }

            if (dto.Items.Any(i => i.Quantity <= 0))
            {
                throw new ArgumentException("All item quantities must be greater than 0");
            }

            await using var transaction = await _uow.BeginTransactionAsync(ct);

            try
            {

                var sale = new Sale
                {
                    Date = DateTime.UtcNow,
                    SaleItems = new List<SaleItem>()
                };

                decimal totalAmount = 0m;
                int totalQuantity = 0;

                foreach (var item in dto.Items)
                {
                    var product = await _uow.Products.GetByIdForUpdateAsync(item.ProductId, ct);
                    if (product == null)
                    {
                        throw new KeyNotFoundException($"Product not found: {item.ProductId}");
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        throw new InvalidOperationException($"Not enough stock for product {product.Name} (Id = {product.ProductId}).");
                    }

                    // Ul stokun
                    product.StockQuantity -= item.Quantity;

                    var saleItem = new SaleItem
                    {
                        ProductId = product.ProductId,
                        Quantity = item.Quantity,
                        Price = product.Price
                    };

                    sale.SaleItems.Add(saleItem);

                    // Totals
                    totalQuantity += item.Quantity;
                    totalAmount += product.Price * item.Quantity;

                    var tx = new StockTransaction
                    {
                        ProductId = product.ProductId,
                        QuantityChange = -item.Quantity,
                        Type = "OUT",
                        Date = DateTime.UtcNow
                    };

                    await _uow.StockTransactions.AddAsync(tx, ct);
                }

                sale.TotalAmount = totalAmount;
                sale.TotalQuantity = totalQuantity;

                await _uow.Sales.AddAsync(sale, ct);

                await _uow.SaveChangesAsync(ct);

                await transaction.CommitAsync(ct);

                var created = await _uow.Sales.GetByIdWithDetailsAsync(sale.SaleId, ct);
                if (created == null)
                {
                    throw new Exception("Unexcepted error: created sale not found");
                }
                return _mapper.Map<SaleDetailsDTO>(created);

            }
            catch
            {
                await transaction.RollbackAsync(ct);
                throw;
            }
        }
            

    
        public async Task<PagedResult<SaleReadDTO>> GetAllAsync(SaleQueryParams query, CancellationToken ct = default)
        {
            var paged = await _uow.Sales.GetPagedAsync(query, ct);

            return new PagedResult<SaleReadDTO>
            { 
                Items = _mapper.Map<List<SaleReadDTO>>(paged.Items),
                Page = paged.Page,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount,
                TotalPages = paged.TotalPages,
            };
        }

        public async Task<SaleDetailsDTO> GetDetailsAsync(int saleId, CancellationToken ct = default)
        {
            var sale = await _uow.Sales.GetByIdWithDetailsAsync(saleId, ct);
            if(sale == null)
            {
                throw new KeyNotFoundException("Sale not found");
            }
            return _mapper.Map<SaleDetailsDTO>(sale);
        }


    }
}
