using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Web.Common.PublishedModels;

namespace Altigen.Web.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    private readonly UmbracoHelper _umbracoHelper;

    public HeaderViewComponent(UmbracoHelper umbracoHelper)
    {
        _umbracoHelper = umbracoHelper;
    }

    public IViewComponentResult Invoke()
    {
        var settingsNode = _umbracoHelper.ContentAtRoot().DescendantsOrSelf<Settings>().FirstOrDefault();
        
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
