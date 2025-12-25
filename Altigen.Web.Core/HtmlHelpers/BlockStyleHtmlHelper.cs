using Altigen.Web.Core.Services;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Altigen.Web.Core.HtmlHelpers
{
    public static class BlockStyleHtmlHelper
    {
        // Helper to resolve the service privately
        private static IBlockStyleService? GetService(IHtmlHelper html)
        {
            return html.ViewContext.HttpContext.RequestServices.GetService<IBlockStyleService>();
        }

        /// <summary>
        /// Renders the generated <style> tag containing all block styles for the current content.
        /// </summary>
        public static IHtmlContent RenderGeneratedStyles(this IHtmlHelper html, IPublishedContent content)
        {
            var service = GetService(html);
            if (service == null || content == null) return HtmlString.Empty;

            var styles = service.GetPageStyles(content);
            if (string.IsNullOrWhiteSpace(styles)) return HtmlString.Empty;

            return new HtmlString($"<style>\n{styles}\n</style>");
        }

        /// <summary>
        /// Returns the unique CSS class name for a given block item.
        /// </summary>
        public static string GetUniqueBlockClass(this IHtmlHelper html, BlockGridItem item)
        {
            if (item?.Content == null) return string.Empty;
            
            var service = GetService(html);
            // Fallback if service unavailable (though unlikely), generate manually to avoid crash
            return service?.GetUniqueBlockClass(item.Content.Key) ?? $"codeislife-{item.Content.Key:N}";
        }

        /// <summary>
        /// Returns the unique CSS class name for a given block list item.
        /// </summary>
        public static string GetUniqueBlockClass(this IHtmlHelper html, BlockListItem item)
        {
             if (item?.Content == null) return string.Empty;

            var service = GetService(html);
            return service?.GetUniqueBlockClass(item.Content.Key) ?? $"codeislife-{item.Content.Key:N}";
        }
    }
}
