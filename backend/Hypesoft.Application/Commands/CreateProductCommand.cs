using MediatR;

namespace Hypesoft.Application.Commands;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    Guid CategoryId,
    int Stock
) : IRequest<Guid>;
