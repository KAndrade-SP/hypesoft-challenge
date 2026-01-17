using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository
{
    Task AddAsync(Product product);
    Task<Product?> GetByIdAsync(Guid id);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id);

    Task<List<Product>> GetAllAsync(int page, int pageSize);
    Task<List<Product>> SearchByNameAsync(string name);
    Task<List<Product>> GetByCategoryAsync(Guid categoryId);
    Task<List<Product>> GetLowStockAsync();
}
