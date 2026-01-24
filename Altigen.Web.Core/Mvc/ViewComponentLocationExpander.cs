using Microsoft.AspNetCore.Mvc.Razor;

namespace Altigen.Web.Core.Mvc;

public class ViewComponentLocationExpander : IViewLocationExpander
{
    public void PopulateValues(ViewLocationExpanderContext context)
    {
        // No values to persist in the cache key
    }

    public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
    {
        // Add specific ViewComponent paths where we want to look for partials
        // {0} is the view name
        var extraLocations = new[]
        {
            "/Views/Shared/Components/MainSlider/{0}.cshtml",
            // Add other component paths here if generic pattern isn't enough
        };

        // Combine existing locations with new ones
        foreach (var location in viewLocations)
        {
            yield return location;
        }

        foreach (var location in extraLocations)
        {
            yield return location;
        }
    }
}
