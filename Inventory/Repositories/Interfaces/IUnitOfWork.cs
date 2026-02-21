using Microsoft.EntityFrameworkCore.Storage;

namespace Inventory.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        ICategoryRepository Categories { get; }
        IProductRepository Products { get; }
        ISaleRepository Sales { get; }
        IStockTransactionRepository StockTransactions { get; }

        Task<int> SaveChangesAsync(CancellationToken ct = default);

        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);

    }
}
