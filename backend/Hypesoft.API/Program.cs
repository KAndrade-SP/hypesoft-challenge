using FluentValidation;
using FluentValidation.AspNetCore;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Validators;
using Hypesoft.Infrastructure.Configurations;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Hypesoft.API.Security;

var builder = WebApplication.CreateBuilder(args);

// Controllers + FluentValidation auto-validation
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();

// MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly)
);

// Infra
builder.Services.AddMongoDb(builder.Configuration);
builder.Services.AddInfrastructure();

// Swagger + Health
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var keycloakUrl = builder.Configuration["KEYCLOAK_URL"] ?? "http://localhost:8080";
var keycloakRealm = builder.Configuration["KEYCLOAK_REALM"] ?? "hypesoft";
var keycloakClientId = builder.Configuration["KEYCLOAK_CLIENT_ID"] ?? "hypesoft-api";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.Authority = $"{keycloakUrl}/realms/{keycloakRealm}";
        options.Audience = keycloakClientId;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            RoleClaimType = "roles",
            ValidIssuers = new[]
            {
                $"{keycloakUrl}/realms/{keycloakRealm}",
                $"http://localhost:8080/realms/{keycloakRealm}"
            }
        };
    });

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddSingleton<IClaimsTransformation, KeycloakRoleClaimsTransformation>();

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var ex = feature?.Error;

        if (ex is ArgumentException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new { error = "Unexpected error" });
    });
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health").AllowAnonymous();
app.MapControllers();

app.Run();
