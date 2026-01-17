using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetProductsQuery(
    string? Search,
    Guid? CategoryId,
    int Page = 1,
    int PageSize = 10
) : IRequest<IEnumerable<ProductDto>>;
