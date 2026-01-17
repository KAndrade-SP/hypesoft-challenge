using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Repositories;
using Hypesoft.Infrastructure.Data;

namespace Hypesoft.Infrastructure.Configurations;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMongoDb(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("MongoDb")
            ?? throw new InvalidOperationException("MongoDb connection string not found");

        var databaseName =
            configuration["MongoDbDatabase"]
            ?? throw new InvalidOperationException("MongoDbDatabase not found");

        services.AddDbContext<AppDbContext>(options =>
            options.UseMongoDB(connectionString, databaseName));

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        return services;
    }
}
