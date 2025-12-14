using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco.Extensions;
using Altigen.Web.Models; // Assuming this namespace for ViewModel, otherwise I will define it here or in Core.

namespace Altigen.Web.ViewComponents
{
    public class SeoViewComponent : ViewComponent
    {
        private readonly UmbracoHelper _umbracoHelper;

        public SeoViewComponent(UmbracoHelper umbracoHelper)
        {
            _umbracoHelper = umbracoHelper;
        }

        public IViewComponentResult Invoke(IPublishedContent? content = null)
        {
            // If no content passed, try to use assigned content item
            content ??= _umbracoHelper.AssignedContentItem;

            if (content == null)
            {
                return Content(string.Empty);
            }

            var model = new SeoViewModel
            {
                Title = GetFallbackValue(content, "seoPageTitle"),
                Description = GetFallbackValue(content, "seoPageDescription")
            };

            return View(model);
        }

        private string? GetFallbackValue(IPublishedContent content, string alias)
        {
            // 1. Current Page
            var value = content.Value<string>(alias);
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            // 2. Ancestors (closest first) who implement the property or have it
            // We use HasValue to ensure we don't pick up empty strings if configured that way, 
            // but Value<string> check above handles empty strings.
            // Let's iterate ancestors.
            var ancestor = content.Ancestors().FirstOrDefault(x => !string.IsNullOrWhiteSpace(x.Value<string>(alias)));
            if (ancestor != null)
            {
                return ancestor.Value<string>(alias);
            }

            // 3. Fallback to Root
            // Note: Ancestors() includes parents up to root, but sometimes "Root" might mean the specific site root
            // which Ancestors() covers. However, if we are in a sub-node and Ancestors didn't find it,
            // we might want to explicitly check the Level 1 node. 
            // Usually specific "SEO Settings" are on the Home Page (Root).
            // Any specific "Content Root" logic is covered by Ancestors().last usually.
            // If the user meant "Global Settings" that are NOT in the tree, that's different, 
            // but the prompt said "Parent, parent empty -> ContentRoot".
            // Ancestors() covers this path.
            
            return null;
        }
    }

    public class SeoViewModel
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
}
