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
        var settingsNode = _umbracoHelper.ContentAtRoot().DescendantsOrSelf<GlobalSettings>().FirstOrDefault();

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

        var logo = new LogoViewModel
        {
            DesktopLogo = footerDesktop,
            TabletLogo = footerTablet,
            MobileLogo = footerMobile,
            Location = LogoLocation.Footer
        };

        var model = new FooterViewModel
        {
            Logo = logo,
            Description = settingsNode.FooterSettingsDescription ?? string.Empty,
            Address = settingsNode.FooterSettingsAddress,
            Phone = settingsNode.FooterSettingsPhone,
            Email = settingsNode.FooterSettingsEmail,
            PrivacyPolicy = settingsNode.FooterSettingsPrivacyPolicy,
            CookiePolicy = settingsNode.FooterSettingsCookiePolicy,
            Gdpr = settingsNode.FooterSettingsGdpr,
            SocialIcons = settingsNode.FooterSettingsSocialIcons?
                .Select(x => x.Content)
                .OfType<SocialItem>()
                .Where(x => x.SocialItemUrl != null)
        };

        return View(model);
    }
}
