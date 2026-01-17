using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface ICategoryRepository
{
    Task AddAsync(Category category);
    Task<IEnumerable<Category>> GetAllAsync();
    Task<IEnumerable<Category>> SearchByNameAsync(string name);
    Task<Category?> GetByIdAsync(Guid id);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Guid id);
}
