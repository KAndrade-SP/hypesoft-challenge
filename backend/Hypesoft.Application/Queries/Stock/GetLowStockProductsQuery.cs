using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetLowStockProductsQuery() : IRequest<IEnumerable<ProductDto>>;
