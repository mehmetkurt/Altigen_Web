using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Web;

namespace Altigen.Web.ViewComponents
{
    public class PageHeaderViewComponent(IUmbracoContextAccessor umbracoContextAccessor) : ViewComponent
    {
        private readonly IUmbracoContextAccessor _umbracoContextAccessor = umbracoContextAccessor;

        public IViewComponentResult Invoke()
        {
            var content = _umbracoContextAccessor.GetRequiredUmbracoContext().PublishedRequest?.PublishedContent;

            if (content is IPageHeader pageHeader)
            {
                return View(pageHeader);
            }

            return Content(string.Empty);
        }
    }
}
