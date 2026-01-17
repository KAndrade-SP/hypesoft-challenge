using MediatR;

namespace Hypesoft.Application.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest<Unit>;
