using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.AspNetCore;

namespace Altigen.Web.ViewComponents
{
    public class MainSliderViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(IPublishedContent model)
        {
            // Assuming we might pass the page model or just return the view for now as the content is hardcoded in the example.
            // If the user wants dynamic content, we'd fetch it here. For now, matching the static HTML.
            return View(model);
        }
    }
}
