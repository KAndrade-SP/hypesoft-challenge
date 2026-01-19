using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace Hypesoft.API.Security;

public class KeycloakRoleClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not ClaimsIdentity identity)
        {
            return Task.FromResult(principal);
        }

        var realmAccessClaim = identity.FindFirst("realm_access");
        if (realmAccessClaim is null)
        {
            return Task.FromResult(principal);
        }

        try
        {
            using var document = JsonDocument.Parse(realmAccessClaim.Value);
            if (!document.RootElement.TryGetProperty("roles", out var rolesElement) ||
                rolesElement.ValueKind != JsonValueKind.Array)
            {
                return Task.FromResult(principal);
            }

            foreach (var roleElement in rolesElement.EnumerateArray())
            {
                var role = roleElement.GetString();
                if (string.IsNullOrWhiteSpace(role))
                {
                    continue;
                }

                if (!identity.HasClaim("roles", role))
                {
                    identity.AddClaim(new Claim("roles", role));
                }

                if (!identity.HasClaim(ClaimTypes.Role, role))
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
                }
            }
        }
        catch (JsonException)
        {
            return Task.FromResult(principal);
        }

        return Task.FromResult(principal);
    }
}
