using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common.PublishedModels;

namespace Altigen.Web.ViewComponents;

public class LogoViewComponent : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(LogoViewModel logo)
    {
        // 1. Resolve Raw URLs
        var rawDesktop = logo.DesktopLogo?.Url();
        var rawTablet = logo.TabletLogo?.Url();
        var rawMobile = logo.MobileLogo?.Url();

        // 2. Apply Fallback Logic (Mobile > Tablet > Desktop)
        // If a specific size is missing, it falls back to the next larger size available.
        logo.DesktopUrl = rawDesktop ?? rawTablet ?? rawMobile;
        logo.TabletUrl = rawTablet ?? logo.DesktopUrl; // Fallback to Desktop
        logo.MobileUrl = rawMobile ?? logo.TabletUrl; // Fallback to Tablet (which is already Desktop if missing)

        return await Task.FromResult(View(logo));
    }
}
