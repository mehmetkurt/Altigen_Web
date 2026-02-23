using Umbraco.Cms.Core.Models.PublishedContent;

namespace Altigen.Web.Models;

public class RegionFilterViewModel
{
    public IEnumerable<IPublishedContent> UsedCountries { get; set; } = [];
    public IEnumerable<IPublishedContent> UsedCities { get; set; } = [];
    public IEnumerable<IPublishedContent> UsedDistricts { get; set; } = [];
    public IEnumerable<IPublishedContent> UsedNeighborhoods { get; set; } = [];
    
    public string SelectedDistrictSlug { get; set; } = string.Empty;
    public string SelectedNeighborhoodSlug { get; set; } = string.Empty;
    
    public IPublishedContent? SelectedDistrict { get; set; }
    public IPublishedContent? SelectedNeighborhood { get; set; }
    
    public string BaseUrl { get; set; } = string.Empty;
    public int TotalItems { get; set; }
}
