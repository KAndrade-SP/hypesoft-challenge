using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class GetLowStockProductsHandler : IRequestHandler<GetLowStockProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetLowStockProductsHandler(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetLowStockAsync();
        var categories = (await _categoryRepository.GetAllAsync()).ToList();
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        return products.Select(p => new ProductDto(
            p.Id,
            p.Name,
            p.Description,
            p.Price,
            p.StockQuantity,
            p.CategoryId,
            categoryDict.GetValueOrDefault(p.CategoryId, "Unknown")
        ));
    }
}
