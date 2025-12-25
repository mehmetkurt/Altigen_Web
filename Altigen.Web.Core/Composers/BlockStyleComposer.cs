using Altigen.Web.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Altigen.Web.Core.Composers
{
    public class BlockStyleComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<IBlockStyleService, BlockStyleService>();
        }
    }
}
