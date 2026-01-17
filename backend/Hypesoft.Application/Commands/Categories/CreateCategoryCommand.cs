using MediatR;

namespace Hypesoft.Application.Commands;

public record CreateCategoryCommand(string Name) : IRequest<Guid>;
