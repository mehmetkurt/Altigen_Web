using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Web.Common.PublishedModels;
using Umbraco.Extensions;

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
        // Returns the first found Navigation node at the root.
        var navigationNode = _umbracoHelper.ContentAtRoot()
            .OfType<Navigation>()
            .FirstOrDefault();

        return View(navigationNode);
    }
}
