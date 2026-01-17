using MediatR;

namespace Hypesoft.Application.Commands;

public record DeleteProductCommand(Guid Id) : IRequest<Unit>;

