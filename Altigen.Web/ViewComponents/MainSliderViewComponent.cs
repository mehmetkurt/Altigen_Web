using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common.AspNetCore;

namespace Altigen.Web.ViewComponents
{
    public class MainSliderViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(IPublishedContent model)
        {
            if (model == null) return Content("");
            return await Task.FromResult(View(model));
        }
    }
}
