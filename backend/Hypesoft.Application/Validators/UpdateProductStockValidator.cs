using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class UpdateProductStockValidator : AbstractValidator<UpdateProductStockCommand>
{
    public UpdateProductStockValidator()
    {
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);
    }
}
