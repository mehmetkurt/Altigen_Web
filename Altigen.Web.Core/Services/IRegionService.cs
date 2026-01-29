using Umbraco.Cms.Core.Models.PublishedContent;

namespace Altigen.Web.Core.Services;

public interface IRegionService
{
    /// <summary>
    /// Gets distinct location data (Countries, Cities, Districts, Neighborhoods) used by Regions within a logical category scope.
    /// </summary>
    /// <param name="category">The parent category (e.g. RegionCategory). If null, might return empty or logic for global search if needed.</param>
    /// <returns>RegionLocationData containing lists of locations.</returns>
    RegionLocationData GetLocationsForCategory(IPublishedContent category);

    /// <summary>
    /// Filters categories using a resolved Selection object (Neighborhood or District).
    /// </summary>
    IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, IPublishedContent? effectiveSelection);

    /// <summary>
    /// Filters categories that have at least one Region covering the selected location.
    /// </summary>
    /// <param name="categories">The list of categories to filter.</param>
    /// <param name="districtSlug">Selected district URL segment.</param>
    /// <param name="neighborhoodSlug">Selected neighborhood URL segment.</param>
    /// <returns>Filtered categories.</returns>
    IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, string districtSlug, string neighborhoodSlug);

    /// <summary>
    /// Gets related services (other Regions) that serve the same locations as the current region.
    /// </summary>
    /// <param name="currentRegion">The current reference region.</param>
    /// <param name="maxCount">Maximum number of related items to return.</param>
    /// <returns>Related Region items.</returns>
    IEnumerable<IPublishedContent> GetRelatedServicesInLocation(IPublishedContent currentRegion, int maxCount = 5);
}

public class RegionLocationData
{
    public IEnumerable<IPublishedContent> Countries { get; set; } = Enumerable.Empty<IPublishedContent>();
    public IEnumerable<IPublishedContent> Cities { get; set; } = Enumerable.Empty<IPublishedContent>();
    public IEnumerable<IPublishedContent> Districts { get; set; } = Enumerable.Empty<IPublishedContent>();
    public IEnumerable<IPublishedContent> Neighborhoods { get; set; } = Enumerable.Empty<IPublishedContent>();
}
