namespace Hypesoft.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = null!;
    public string Description { get; private set; } = null!;

    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid CategoryId { get; private set; }

    protected Product() { }

    public Product(string name, string description, decimal price, int stockQuantity, Guid categoryId)
    {
        Id = Guid.NewGuid();
        Update(name, description, price, stockQuantity, categoryId);
    }

    public void Update(string name, string description, decimal price, int stockQuantity, Guid categoryId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name is required");

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Product description is required");

        if (name.Length > 45)
            throw new ArgumentException("Product name must be at most 45 characters");

        if (description.Length > 100)
            throw new ArgumentException("Product description must be at most 100 characters");

        if (price <= 0)
            throw new ArgumentException("Price must be greater than zero");

        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
    }

    public bool IsLowStock() => StockQuantity < 10;
}
