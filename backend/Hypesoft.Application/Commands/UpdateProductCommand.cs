using MediatR;

namespace Hypesoft.Application.Commands;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    Guid CategoryId,
    int Stock
) : IRequest<Unit>;
