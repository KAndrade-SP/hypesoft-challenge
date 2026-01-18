using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries;

public record GetDashboardSummaryQuery() : IRequest<DashboardSummaryDto>;
