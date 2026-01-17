namespace Hypesoft.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }

    protected Category() { }

    public Category(string name)
    {
        Id = Guid.NewGuid();
        Update(name);
    }

    public void Update(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name is required");

        if (name.Length > 45)
            throw new ArgumentException("Category name must be at most 45 characters");

        Name = name;
    }
}
