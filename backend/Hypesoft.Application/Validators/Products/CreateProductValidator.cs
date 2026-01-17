using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(45);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Price).GreaterThan(0);

        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);

        RuleFor(x => x.CategoryId).NotEmpty();
    }
}

