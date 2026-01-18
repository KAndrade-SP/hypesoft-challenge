namespace Hypesoft.Application.DTOs;

public record DashboardSummaryDto(
    int TotalProducts,
    decimal TotalStockValue,
    IEnumerable<ProductDto> LowStockProducts,
    IEnumerable<CategoryCountDto> ProductsByCategory
);
