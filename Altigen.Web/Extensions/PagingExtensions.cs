using Altigen.Web.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Altigen.Web.Extensions
{
    public static class PagingExtensions
    {
        /// <summary>
        /// Retrieves the effective paging configuration by traversing up the content tree
        /// if 'Inherit Parent' is enabled.
        /// </summary>
        public static PagingConfigModel GetEffectivePagingConfig(this IPublishedContent content)
        {
            var config = new PagingConfigModel();

            // 1. Check if current content supports IPaging
            if (content is IPaging pagingItem)
            {
                // 2. Base Configuration (Inheritance vs Local)
                // If InheritParent is TRUE, start with Parent's config.
                // If InheritParent is FALSE, start with Default config (to be filled by Local).
                if (pagingItem.PagingInheritParent && content.Parent != null)
                {
                    config = content.Parent.GetEffectivePagingConfig();
                }
                else
                {
                    // No inheritance (or root), set Local Booleans
                    config.ShowFirst = pagingItem.PagingShowFirst;
                    config.ShowLast = pagingItem.PagingShowLast;
                    config.ShowNext = pagingItem.PagingShowNext;
                    config.ShowPrev = pagingItem.PagingShowPrev;
                }

                // 3. Integer Overrides (User Requirement: "If > 0, use valid local value")
                // These apply regardless of Inheritance setting.
                if (pagingItem.PagingPageSize > 0)
                {
                    config.PageSize = pagingItem.PagingPageSize;
                }

                if (pagingItem.PagingMaxPagerCount > 0)
                {
                    config.MaxPagerCount = pagingItem.PagingMaxPagerCount;
                }
            }
            else if (content.Parent != null)
            {
                // Passthrough: Content doesn't have paging settings, look up to parent
                return content.Parent.GetEffectivePagingConfig();
            }

            return config;
        }

        private static PagingConfigModel MapToConfig(IPaging item)
        {
            // This helper is no longer used in the recursive logic but kept if needed or removed.
            // Removing it to keep code clean.
            return new PagingConfigModel();
        }
    }
}
