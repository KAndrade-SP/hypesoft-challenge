using MediatR;

namespace Hypesoft.Application.Commands;

public record UpdateProductStockCommand(Guid Id, int Stock) : IRequest<Unit>;
