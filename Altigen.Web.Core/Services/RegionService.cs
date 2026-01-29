using Altigen.Web.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Altigen.Web.Core.Services;

public class RegionService : IRegionService
{
    public RegionLocationData GetLocationsForCategory(IPublishedContent category)
    {
        var data = new RegionLocationData();
        var usedCountries = new HashSet<IPublishedContent>(new PublishedContentComparer());
        var usedCities = new HashSet<IPublishedContent>(new PublishedContentComparer());
        var usedDistricts = new HashSet<IPublishedContent>(new PublishedContentComparer());
        var usedNeighborhoods = new HashSet<IPublishedContent>(new PublishedContentComparer());

        // Recursive helper to collect parents
        void CollectParents(IPublishedContent? content)
        {
            if (content == null) return;

            switch (content.ContentType.Alias)
            {
                case Neighborhood.ModelTypeAlias:
                    usedNeighborhoods.Add(content);
                    CollectParents(content.Parent());
                    break;
                case District.ModelTypeAlias:
                    usedDistricts.Add(content);
                    CollectParents(content.Parent());
                    break;
                case City.ModelTypeAlias:
                    usedCities.Add(content);
                    CollectParents(content.Parent());
                    break;
                case Country.ModelTypeAlias:
                    usedCountries.Add(content);
                    break;
            }
        }

        // Logic adapted from RegionList.cshtml
        // If category is RegionCategory, we look at its children.
        // If category is a list root (like RegionList), we look at its children categories then their regions?
        // Let's assume the passed 'category' is the root context we want to search under.
        // If 'category' is RegionList, it has RegionCategory children.
        // If 'category' is RegionCategory, it has Region children.

        IEnumerable<Region> regions = [];

        if (category is RegionList)
        {
            var categories = category.Children<RegionCategory>()?
                .Where(x => x.IsVisible())
                .ToList() ?? [];

            regions = categories.SelectMany(c => c.Children<Region>() ?? []);
        }
        else if (category is RegionCategory cat)
        {
             regions = cat.Children<Region>()?.Where(x => x.IsVisible()) ?? [];
        }

        foreach (var region in regions)
        {
            if (region.RegionLocation != null)
            {
                foreach (var loc in region.RegionLocation)
                {
                    CollectParents(loc);
                }
            }
        }

        data.Countries = usedCountries;
        data.Cities = usedCities;
        data.Districts = usedDistricts;
        data.Neighborhoods = usedNeighborhoods;

        return data;
    }


    public IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, string districtSlug, string neighborhoodSlug)
    {
        // This functionality is deprecated or requires resolving slugs to IPublishedContent first.
        // Currently falling back to returning input to avoid runtime errors similar to previous implementation plan.
        return categories;
    }

    public IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, IPublishedContent? effectiveSelection)
    {
        if (effectiveSelection == null) return categories;

        return categories.Where(cat => {
            var regions = cat.Children<Region>();
            if (regions == null) return false;
            
            return regions.Any(r => 
            {
                if (r.RegionLocation == null) return false;
                foreach(var loc in r.RegionLocation)
                {
                    if (loc.Id == effectiveSelection.Id) return true;
                    if (effectiveSelection.IsDescendant(loc)) return true;
                    if (loc.IsDescendant(effectiveSelection)) return true;
                }
                return false;
            });
        });
    }
    
    // Legacy support via overload is not strictly needed if we don't expose it in Interface, but we did. 
    // Wait, the error said "Member with same parameter types". 
    // Ah, I see: FilterCategoriesByLocation(IEnumerable<IPublishedContent>, string, string) 
    // vs FilterCategoriesByLocation(IEnumerable<IPublishedContent>, string, string) if I did copy paste error?
    // Looking at the file content in step 336:
    // Line 84: public IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, string districtSlug, string neighborhoodSlug)
    // Line 189: public IEnumerable<IPublishedContent> FilterCategoriesByLocation(IEnumerable<IPublishedContent> categories, string districtSlug, string neighborhoodSlug)
    // YES, it is duplicated. I will remove the second one (lines 189-195) and keep the first one.
    // Also fixing Nullability in Comparer.

    public IEnumerable<IPublishedContent> GetRelatedServicesInLocation(IPublishedContent currentRegion, int maxCount = 5)
    {
        if (currentRegion is not Region region || region.RegionLocation == null || !region.RegionLocation.Any()) 
            return [];

        // Logic: Find other regions (services) that share at least one location.
        // Since regions are typically children of Category -> RegionList, we can traverse up.
        
        var category = region.Parent(); // RegionCategory
        if (category == null) return [];
        
        // If we want related services from *any* category:
        var regionList = category.Parent(); // RegionList
        var allRegions = regionList?.Children<RegionCategory>()?
            .SelectMany(x => x.Children<Region>()) 
            ?? category.Children<Region>() ?? [];
            
        // Filter
        var related = allRegions
            .Where(x => x.Id != region.Id && x.IsVisible())
            .Where(x => x.RegionLocation != null && x.RegionLocation.Any(l => 
                region.RegionLocation.Any(rl => rl.Id == l.Id || l.IsDescendantOrSelf(rl) || rl.IsDescendantOrSelf(l))
            ))
            .OrderBy(_ => Guid.NewGuid()) // Randomize
            .Take(maxCount);

        return related;
    }
}


// Reuse the Comparer
public class PublishedContentComparer : IEqualityComparer<IPublishedContent?>
{
    public bool Equals(IPublishedContent? x, IPublishedContent? y)
    {
        if (Object.ReferenceEquals(x, y)) return true;
        if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null)) return false;
        return x.Id == y.Id;
    }

    public int GetHashCode(IPublishedContent? obj)
    {
        if (Object.ReferenceEquals(obj, null)) return 0;
        return obj.Id.GetHashCode();
    }
}
