using Altigen.Web.Models;

namespace Altigen.Web.Core.Services
{
    public interface IGlobalSettingsService
    {
        GlobalSettings? GetCurrentSettings();
    }
}
