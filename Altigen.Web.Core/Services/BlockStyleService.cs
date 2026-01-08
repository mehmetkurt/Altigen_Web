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

        private string GenerateStylesRecursive(IPublishedElement content)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"/* Generated Styles for Content: {content.Key} - {DateTime.Now} */");
            TraverseProperties(content, sb);
            return sb.ToString();
        }

        private void TraverseProperties(IPublishedElement content, StringBuilder sb)
        {
            if (content == null) return;

            foreach (var property in content.Properties)
            {
                if (property.PropertyType.EditorAlias.Contains("BlockGrid", StringComparison.InvariantCultureIgnoreCase) || 
                    property.PropertyType.EditorAlias.Contains("BlockList", StringComparison.InvariantCultureIgnoreCase))
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
        }

        private void ExtractBlockStyles(BlockGridItem item, StringBuilder sb)
        {
            if (item?.Content == null) return;

            // 1. Generate styles for this block's settings
            GenerateCssForBlock(item.Settings, item.Content.Key, sb);

            // 2. Recurse into this block's content properties (e.g. nested Block Lists)
            TraverseProperties(item.Content, sb);

            // 3. Recurse into Areas (standard Block Grid nesting)
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
            if (item?.Content == null) return;

            // 1. Generate styles for this block's settings
            GenerateCssForBlock(item.Settings, item.Content.Key, sb);
            
            // 2. Recurse into this block's content properties
            TraverseProperties(item.Content, sb);
        }

        private void GenerateCssForBlock(IPublishedElement? settings, Guid key, StringBuilder sb)
        {
            if (settings == null) return;

            var responsiveStyles = settings.GetResponsiveBlockStyles();
            
            if (responsiveStyles.TryGetValue("base", out var baseStyle) && baseStyle.Length > 0)
            {
                var className = GetUniqueBlockClass(key);
                sb.AppendLine($".{className} {{ {baseStyle} }} /* Base Style for {key} */");
            }
            else 
            {
                 sb.AppendLine($"/* No base style found for {key} - Settings: { (settings != null ? "Present" : "Null") } */");
            }

            if (responsiveStyles.TryGetValue("tablet", out var tabletStyle) && tabletStyle.Length > 0)
            {
                var className = GetUniqueBlockClass(key);
                sb.AppendLine($"@media (min-width: 768px) {{ .{className} {{ {tabletStyle} }} }}");
            }

            if (responsiveStyles.TryGetValue("desktop", out var desktopStyle) && desktopStyle.Length > 0)
            {
                var className = GetUniqueBlockClass(key);
                sb.AppendLine($"@media (min-width: 992px) {{ .{className} {{ {desktopStyle} }} }}");
            }
        }
    }
}
