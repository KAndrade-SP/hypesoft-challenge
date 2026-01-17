using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetCategoriesQuery(string? Name) : IRequest<IEnumerable<CategoryDto>>;
