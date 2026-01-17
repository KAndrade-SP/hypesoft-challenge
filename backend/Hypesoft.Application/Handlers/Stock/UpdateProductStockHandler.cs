using Hypesoft.Application.Commands;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class UpdateProductStockHandler : IRequestHandler<UpdateProductStockCommand, Unit>
{
    private readonly IProductRepository _repository;

    public UpdateProductStockHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(UpdateProductStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return Unit.Value;

        product.Update(
            product.Name,
            product.Description,
            product.Price,
            request.Stock,
            product.CategoryId
        );

        await _repository.UpdateAsync(product);
        return Unit.Value;
    }
}
