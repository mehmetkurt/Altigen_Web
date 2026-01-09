using Altigen.Web.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Altigen.Web.Core.Composers
{
    public class ServiceComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddScoped<IGlobalSettingsService, GlobalSettingsService>();
        }
    }
}
