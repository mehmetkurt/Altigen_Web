using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;

namespace Altigen.Web.ViewComponents;

public class FooterMenuViewComponent : ViewComponent
{
    private readonly UmbracoHelper _umbracoHelper;

    public FooterMenuViewComponent(UmbracoHelper umbracoHelper)
    {
        _umbracoHelper = umbracoHelper;
    }

    public IViewComponentResult Invoke()
    {
        var globalSettings = _umbracoHelper.ContentAtRoot()
            .OfType<GlobalSettings>()
            .FirstOrDefault();

        var navigationNode = globalSettings?.FooterSettingsMenu;

        return View(navigationNode);
    }
}
