using System.Globalization;
using Altigen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;

namespace Altigen.Web.ViewComponents;

public class LanguageSelectorViewComponent(IUmbracoContextAccessor umbracoContextAccessor, ILanguageService languageService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
        {
            return Content(string.Empty);
        }

        var content = umbracoContext.PublishedRequest?.PublishedContent;
        if (content == null)
        {
            return Content(string.Empty);
        }

        var model = new LanguageSelectorViewModel();
        var currentCulture = System.Threading.Thread.CurrentThread.CurrentUICulture.Name;
        var allLanguages = await languageService.GetAllAsync();

        foreach (var culture in content.Cultures)
        {
            var language = allLanguages.FirstOrDefault(x => x.IsoCode.Equals(culture.Key, StringComparison.OrdinalIgnoreCase));
            if (language == null) continue;

            var cultureInfo = new CultureInfo(culture.Key);
            var nativeName = cultureInfo.NativeName;
            
            // "Türkçe (Türkiye)" -> "Türkçe"
            if (nativeName.Contains('('))
            {
                nativeName = nativeName.Split('(')[0].Trim();
            }
            
            // Capitalize first letter (some cultures might return lowercase)
            nativeName = char.ToUpper(nativeName[0]) + nativeName[1..];

            var item = new LanguageItem
            {
                Name = nativeName,
                Culture = culture.Key,
                FlagUrl = GetFlagUrl(culture.Key),
                Url = content.Url(culture.Key),
                IsActive = culture.Key.Equals(currentCulture, StringComparison.OrdinalIgnoreCase)
            };

            model.Languages.Add(item);

            if (item.IsActive)
            {
                model.CurrentLanguage = item;
            }
        }

        // If for some reason current culture is not in the list (rare but possible)
        if (model.CurrentLanguage.Culture == string.Empty && model.Languages.Count > 0)
        {
            var firstLanguage = model.Languages.FirstOrDefault();
            if (firstLanguage != null)
            {
                model.CurrentLanguage = firstLanguage;
            }
        }

        return View(model);
    }

    private static string GetFlagUrl(string culture)
    {
        var code = culture.Split('-')[0].ToLower();

        // Custom mapping if needed
        if (code == "en") code = "gb";

        return $"/assets/images/flags/{code}.svg";
    }
}

