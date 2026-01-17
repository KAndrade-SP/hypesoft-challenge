using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetProductsHandler(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        List<Hypesoft.Domain.Entities.Product> products;

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            products = await _productRepository.SearchByNameAsync(request.Search);
        }
        else if (request.CategoryId.HasValue)
        {
            products = await _productRepository.GetByCategoryAsync(request.CategoryId.Value);
        }
        else
        {
            products = await _productRepository.GetAllAsync(request.Page, request.PageSize);
        }

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
