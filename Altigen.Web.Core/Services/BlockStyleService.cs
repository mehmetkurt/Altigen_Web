using System.Text;
using Altigen.Web.Extensions;
using Microsoft.Extensions.Caching.Memory;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Altigen.Web.Core.Services
{
    public class BlockStyleService : IBlockStyleService
    {
        private readonly IAppPolicyCache _runtimeCache;

        public BlockStyleService(AppCaches appCaches)
        {
            _runtimeCache = appCaches.RuntimeCache;
        }

        public string GetPageStyles(IPublishedContent content)
        {
            if (content == null) return string.Empty;

            var cacheKey = $"BlockStyles_{content.Id}_{content.UpdateDate:yyyyMMddHHmmss}";

            return _runtimeCache.GetCacheItem(cacheKey, () => GenerateStylesRecursive(content)) as string ?? string.Empty;
        }

        public string GetUniqueBlockClass(Guid key)
        {
            return $"codeislife-{key:N}";
        }

        private string GenerateStylesRecursive(IPublishedContent content)
        {
            var sb = new StringBuilder();
            
            // Iterate over all properties to find Block Grid / Block List content
            foreach (var property in content.Properties)
            {
                if (property.PropertyType.EditorAlias.InvariantEquals("Umbraco.BlockGrid") || 
                    property.PropertyType.EditorAlias.InvariantEquals("Umbraco.BlockList"))
                {
                    var value = property.GetValue();
                    if (value is BlockGridModel gridModel)
                    {
                        foreach (var item in gridModel)
                        {
                            ExtractBlockStyles(item, sb);
                        }
                    }
                    else if (value is BlockListModel listModel)
                    {
                        foreach (var item in listModel)
                        {
                            ExtractBlockStyles(item, sb);
                        }
                    }
                }
            }

            return sb.ToString();
        }

        private void ExtractBlockStyles(BlockGridItem item, StringBuilder sb)
        {
            GenerateCssForBlock(item.Settings, item.Content.Key, sb);

            // Recursively process areas
            foreach (var area in item.Areas)
            {
                foreach (var child in area)
                {
                    ExtractBlockStyles(child, sb);
                }
            }
        }

        private void ExtractBlockStyles(BlockListItem item, StringBuilder sb)
        {
            GenerateCssForBlock(item.Settings, item.Content.Key, sb);
        }

        private void GenerateCssForBlock(IPublishedElement? settings, Guid key, StringBuilder sb)
        {
            if (settings == null) return;

            // Use the existing extension method to get the style string
            // Note: GetBlockStyles returns IHtmlContent (HtmlString), so we call ToString()
            // The extension method (GetBlockStyles) logic needs to be verified to ensure it returns raw styles 
            // when renderAttribute is false (default). 
            // Looking at the provided file content: public static IHtmlContent GetBlockStyles(..., bool renderAttribute = false)
            // It calls `sb.ToString().Trim()` and returns `new HtmlString(styles)` if renderAttribute is false.
            // So ToString() on HtmlString will return the raw content.
            
            var styles = settings.GetBlockStyles(false).ToString();

            if (!string.IsNullOrWhiteSpace(styles))
            {
                var className = GetUniqueBlockClass(key);
                sb.AppendLine($".{className} {{ {styles} }}");
            }
        }
    }
}
