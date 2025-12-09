using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Web.Common.PublishedModels;

namespace Altigen.Web.ViewComponents;

public class FooterViewComponent : ViewComponent
{
    private readonly UmbracoHelper _umbracoHelper;

    public FooterViewComponent(UmbracoHelper umbracoHelper)
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

        // Business Fallback: Footer defaults to Header logo if not specified
        var headerDesktop = settingsNode.HeaderSettingsLogoDesktop;
        var footerDesktop = settingsNode.FooterSettingsLogoDesktop ?? headerDesktop;
        
        // Pass raw device values - Responsive Fallback handled in LogoViewComponent
        var footerTablet = settingsNode.FooterSettingsLogoTablet;
        var footerMobile = settingsNode.FooterSettingsLogoMobile;

        return View(new LogoViewModel
        {
            DesktopLogo = footerDesktop,
            TabletLogo = footerTablet,
            MobileLogo = footerMobile,
            Location = LogoLocation.Footer
        });
    }
}
