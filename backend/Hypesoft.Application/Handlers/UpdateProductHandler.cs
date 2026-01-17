using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Unit>
{
    private readonly IProductRepository _repository;
    private readonly ICategoryRepository _categoryRepository;

    public UpdateProductHandler(IProductRepository repository, ICategoryRepository categoryRepository)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return Unit.Value;

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        if (category == null)
            throw new ArgumentException("Category not found");

        product.Update(
            request.Name,
            request.Description,
            request.Price,
            request.Stock,
            request.CategoryId
        );

        await _repository.UpdateAsync(product);
        return Unit.Value;
    }
}
