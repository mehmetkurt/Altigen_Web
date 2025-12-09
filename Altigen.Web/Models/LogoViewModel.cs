using Umbraco.Cms.Core.Models;

namespace Altigen.Web.Models;

public record LogoViewModel
{
    public MediaWithCrops? DesktopLogo { get; set; }
    public MediaWithCrops? TabletLogo { get; set; }
    public MediaWithCrops? MobileLogo { get; set; }
    
    // Resolved URLs with fallback logic applied
    public string? DesktopUrl { get; set; }
    public string? TabletUrl { get; set; }
    public string? MobileUrl { get; set; }

    public LogoLocation Location { get; set; }
}