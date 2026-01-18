using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class GetDashboardSummaryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetDashboardSummaryHandler(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var totalProducts = await _productRepository.CountAsync();
        var totalStockValue = await _productRepository.GetTotalStockValueAsync();

        var categories = (await _categoryRepository.GetAllAsync()).ToList();
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        var lowStockProducts = await _productRepository.GetLowStockAsync();
        var lowStockDtos = lowStockProducts.Select(p => new ProductDto(
            p.Id,
            p.Name,
            p.Description,
            p.Price,
            p.StockQuantity,
            p.CategoryId,
            categoryDict.GetValueOrDefault(p.CategoryId, "Unknown")
        ));

        var products = await _productRepository.GetAllAsync();
        var productsByCategory = products
            .GroupBy(p => p.CategoryId)
            .Select(group => new CategoryCountDto(
                group.Key,
                categoryDict.GetValueOrDefault(group.Key, "Unknown"),
                group.Count()
            ))
            .OrderByDescending(item => item.ProductCount)
            .ToList();

        return new DashboardSummaryDto(totalProducts, totalStockValue, lowStockDtos, productsByCategory);
    }
}
