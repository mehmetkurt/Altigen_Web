using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;

namespace Altigen.Web.ViewComponents;

public class HeaderViewComponent(UmbracoHelper umbracoHelper) : ViewComponent
{
    private readonly UmbracoHelper _umbracoHelper = umbracoHelper;

    public IViewComponentResult Invoke()
    {
        var settingsNode = _umbracoHelper.ContentAtRoot().DescendantsOrSelf<GlobalSettings>().FirstOrDefault();

        if (settingsNode == null)
        {
            return View(null);
        }

        // Pass raw values - Fallback is now handled in LogoViewComponent
        var desktop = settingsNode.HeaderSettingsLogoDesktop;
        var tablet = settingsNode.HeaderSettingsLogoTablet;
        var mobile = settingsNode.HeaderSettingsLogoMobile;

        return View(new LogoViewModel
        {
            DesktopLogo = desktop,
            TabletLogo = tablet,
            MobileLogo = mobile,
            Location = LogoLocation.Header
        });
    }
}
