using System.Linq;
using Altigen.Web.Models;
using Umbraco.Cms.Web.Common;
using Umbraco.Extensions;

namespace Altigen.Web.Core.Services
{
    public class GlobalSettingsService : IGlobalSettingsService
    {
        private readonly UmbracoHelper _umbracoHelper;

        public GlobalSettingsService(UmbracoHelper umbracoHelper)
        {
            _umbracoHelper = umbracoHelper;
        }

        public GlobalSettings? GetCurrentSettings()
        {
            var settingsNode = _umbracoHelper.ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == GlobalSettings.ModelTypeAlias);

            if (settingsNode is GlobalSettings settings)
            {
                return settings;
            }
            
            return settingsNode as GlobalSettings;
        }
    }
}
