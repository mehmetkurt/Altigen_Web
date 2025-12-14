using Altigen.Web.Core.Controllers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Web.Common.ApplicationBuilder;
using Umbraco.Extensions;
using Microsoft.Extensions.DependencyInjection;

namespace Altigen.Web.Core.Composers
{
    public class SitemapComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.Configure<UmbracoPipelineOptions>(options =>
            {
                options.AddFilter(new UmbracoPipelineFilter(nameof(SitemapController))
                {
                    Endpoints = app => app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllerRoute(
                            "Sitemap",
                            "sitemap.xml",
                            new { controller = "Sitemap", action = "Index" }
                        );
                    })
                });
            });
        }
    }
}
