using AutoMapper;
using Inventory.DTOs.StockTransactionDTO;
using Inventory.Repositories.Interfaces;
using Inventory.Services.Interfaces;

namespace Inventory.Services.Implementations
{
    public class StockTransactionService : IStockTransactionService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public StockTransactionService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<List<ReadStockTransactionDTO>> GetAllAsync(CancellationToken ct = default)
        {
            var txs = await _uow.StockTransactions.GetAllWithProductAsync(ct);
            return _mapper.Map<List<ReadStockTransactionDTO>>(txs);
        }

        public async Task<List<ReadStockTransactionDTO>> GetByProductIdAsync(int productId, CancellationToken ct = default)
        {
            if(productId <= 0)
            {
                throw new ArgumentException("productId must be greater than 0");
            }

            var txs = await _uow.StockTransactions.GetByProductIdAsync(productId, ct);
            return _mapper.Map<List<ReadStockTransactionDTO>>(txs);
        }

    }
}
