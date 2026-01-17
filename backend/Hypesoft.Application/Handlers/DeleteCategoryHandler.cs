using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, Unit>
{
    private readonly ICategoryRepository _repository;
    private readonly IProductRepository _productRepository;

    public DeleteCategoryHandler(ICategoryRepository repository, IProductRepository productRepository)
    {
        _repository = repository;
        _productRepository = productRepository;
    }

    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var hasProducts = await _productRepository.AnyByCategoryAsync(request.Id);
        if (hasProducts)
            throw new ArgumentException("Category has linked products and cannot be deleted");

        await _repository.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
