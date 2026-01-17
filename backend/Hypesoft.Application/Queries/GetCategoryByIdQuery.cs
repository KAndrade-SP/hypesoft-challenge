using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>;
