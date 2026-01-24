using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;

namespace Altigen.Web.ViewComponents;

public class TopMenuViewComponent : ViewComponent
{
    private readonly UmbracoHelper _umbracoHelper;

    public TopMenuViewComponent(UmbracoHelper umbracoHelper)
    {
        _umbracoHelper = umbracoHelper;
    }

    public IViewComponentResult Invoke()
    {
        // Uses the generated Navigation model to avoid magic strings.
        // Returns the Navigation node with NavigationType "Header"
        var globalSettings = _umbracoHelper.ContentAtRoot()
            .OfType<GlobalSettings>()
            .FirstOrDefault();

        var navigationNode = globalSettings?.HeaderSettingsMenu;

        return View(navigationNode);
    }
}
