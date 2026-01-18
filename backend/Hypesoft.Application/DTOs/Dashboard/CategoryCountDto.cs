namespace Hypesoft.Application.DTOs;

public record CategoryCountDto(
    Guid CategoryId,
    string CategoryName,
    int ProductCount
);
