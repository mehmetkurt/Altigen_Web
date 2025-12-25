using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Models.Blocks;

namespace Altigen.Web.Core.Services
{
    public interface IBlockStyleService
    {
        /// <summary>
        /// Generates and retrieves the CSS styles for all blocks within the given content.
        /// Uses caching based on content ID and update date.
        /// </summary>
        /// <param name="content">The published content to generate styles for.</param>
        /// <returns>A string containing the generated CSS.</returns>
        string GetPageStyles(IPublishedContent content);

        /// <summary>
        /// Generates a unique CSS class name for a block item based on its Key.
        /// Format: codeislife-{cleanGuid}
        /// </summary>
        /// <param name="key">The unique key of the block.</param>
        /// <returns>The CSS class name.</returns>
        string GetUniqueBlockClass(Guid key);
    }
}
