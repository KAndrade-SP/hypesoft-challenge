using Hypesoft.Domain.Entities;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<Product?>;
