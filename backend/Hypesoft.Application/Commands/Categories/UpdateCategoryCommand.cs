using MediatR;

namespace Hypesoft.Application.Commands;

public record UpdateCategoryCommand(Guid Id, string Name) : IRequest<Unit>;
