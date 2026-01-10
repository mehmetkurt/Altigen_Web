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
            var current = content;

            // Traverse up to find the "source of truth"
            while (current != null)
            {
                if (current is IPaging pagingItem)
                {
                    // If Inherit is FALSE, this is our config source.
                    // If Inherit is TRUE, we continue loop to Parent.
                    if (!pagingItem.PagingInheritParent)
                    {
                        return MapToConfig(pagingItem);
                    }
                }

                current = current.Parent;
            }

            // Fallback: If we traversed all the way up and found nothing (or everything inherited),
            // we default to the initial item's values if it supports IPaging, otherwise defaults.
            if (content is IPaging originalPaging)
            {
                return MapToConfig(originalPaging);
            }

            // Absolute fallback (Default values defined in class)
            return new PagingConfigModel();
        }

        private static PagingConfigModel MapToConfig(IPaging item)
        {
            return new PagingConfigModel
            {
                PageSize = item.PagingPageSize > 0 ? item.PagingPageSize : 10,
                MaxPagerCount = item.PagingMaxPagerCount > 0 ? item.PagingMaxPagerCount : 5,
                ShowFirst = item.PagingShowFirst,
                ShowLast = item.PagingShowLast,
                ShowNext = item.PagingShowNext,
                ShowPrev = item.PagingShowPrev
            };
        }
    }
}
