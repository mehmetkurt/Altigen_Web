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
        if (string.IsNullOrWhiteSpace(districtSlug) && string.IsNullOrWhiteSpace(neighborhoodSlug))
        {
            return categories;
        }

        // Gather all referenced locations in the provided context (categories) to resolve slugs
        var allUsedLocations = new HashSet<IPublishedContent>(new PublishedContentComparer());
        
        // We only need to scan if we have slugs to resolve
        var relevantRegions = categories.SelectMany(x => x.Children<Region>() ?? []);
        
        foreach (var region in relevantRegions)
        {
            if (region.RegionLocation == null) continue;
            foreach (var loc in region.RegionLocation)
            {
                // Traverse up to capture parents (e.g. user selects District, but region has Neighborhood assigned)
                var pointer = loc;
                while (pointer != null)
                {
                    allUsedLocations.Add(pointer);
                    pointer = pointer.Parent();
                }
            }
        }

        IPublishedContent? selectedDistrict = null;
        IPublishedContent? selectedNeighborhood = null;

        if (!string.IsNullOrWhiteSpace(districtSlug))
        {
            selectedDistrict = allUsedLocations.FirstOrDefault(x => x.ContentType.Alias == District.ModelTypeAlias && x.UrlSegment() == districtSlug);
        }

        if (!string.IsNullOrWhiteSpace(neighborhoodSlug))
        {
            selectedNeighborhood = allUsedLocations.FirstOrDefault(x => x.ContentType.Alias == Neighborhood.ModelTypeAlias && x.UrlSegment() == neighborhoodSlug);
        }

        // If a slug was provided but not found, return empty (strict filter)
        if ((!string.IsNullOrWhiteSpace(districtSlug) && selectedDistrict == null) ||
            (!string.IsNullOrWhiteSpace(neighborhoodSlug) && selectedNeighborhood == null))
        {
            return [];
        }

        var effectiveSelection = selectedNeighborhood ?? selectedDistrict;
        return FilterCategoriesByLocation(categories, effectiveSelection);
    }

    public IEnumerable<IPublishedContent> FilterRegionsByLocation(IEnumerable<IPublishedContent> regions, string districtSlug, string neighborhoodSlug)
    {
        if (string.IsNullOrWhiteSpace(districtSlug) && string.IsNullOrWhiteSpace(neighborhoodSlug))
        {
            return regions;
        }

        // Gather all referenced locations in the provided context
        var allUsedLocations = new HashSet<IPublishedContent>(new PublishedContentComparer());
        
        foreach (var region in regions.OfType<Region>())
        {
            if (region.RegionLocation == null) continue;
            foreach (var loc in region.RegionLocation)
            {
                var pointer = loc;
                while (pointer != null)
                {
                    allUsedLocations.Add(pointer);
                    pointer = pointer.Parent();
                }
            }
        }

        IPublishedContent? selectedDistrict = null;
        IPublishedContent? selectedNeighborhood = null;

        if (!string.IsNullOrWhiteSpace(districtSlug))
        {
            selectedDistrict = allUsedLocations.FirstOrDefault(x => x.ContentType.Alias == District.ModelTypeAlias && x.UrlSegment() == districtSlug);
        }

        if (!string.IsNullOrWhiteSpace(neighborhoodSlug))
        {
            selectedNeighborhood = allUsedLocations.FirstOrDefault(x => x.ContentType.Alias == Neighborhood.ModelTypeAlias && x.UrlSegment() == neighborhoodSlug);
        }

        if ((!string.IsNullOrWhiteSpace(districtSlug) && selectedDistrict == null) ||
            (!string.IsNullOrWhiteSpace(neighborhoodSlug) && selectedNeighborhood == null))
        {
            return [];
        }

        var effectiveSelection = selectedNeighborhood ?? selectedDistrict;
        return FilterRegionsByLocation(regions, effectiveSelection);
    }

    public IEnumerable<IPublishedContent> FilterRegionsByLocation(IEnumerable<IPublishedContent> regions, IPublishedContent? effectiveSelection)
    {
        if (effectiveSelection == null) return regions;

        return regions.Where(x => 
        {
             if (x is not Region region || region.RegionLocation == null) return false;
             
             return region.RegionLocation.Any(loc => 
             {
                 if (loc.Id == effectiveSelection.Id) return true;
                 if (effectiveSelection.IsDescendant(loc)) return true;
                 if (loc.IsDescendant(effectiveSelection)) return true;
                 return false;
             });
        });
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
        // Traverse up to find the root RegionList
        
        var category = region.AncestorOrSelf<RegionCategory>();
        if (category == null) return [];
        
        var regionList = category.AncestorOrSelf<RegionList>();
        var allRegions = regionList?.Children<RegionCategory>()?
            .SelectMany(x => x.Children<Region>() ?? []) 
            ?? category.Children<Region>() ?? [];
            
        // Filter
        var related = allRegions
            .Where(x => x.Id != region.Id && x.IsVisible())
            .Where(x => x.RegionLocation != null && x.RegionLocation.Any(l => 
                region.RegionLocation.Any(rl => rl.Id == l.Id || l.IsDescendantOrSelf(rl) || rl.IsDescendantOrSelf(l))
            ))
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
