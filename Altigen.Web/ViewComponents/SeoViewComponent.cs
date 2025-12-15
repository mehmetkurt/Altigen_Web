using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco.Extensions;
using Umbraco.Cms.Core.Models;
using Altigen.Web.Models; // Assuming this namespace for ViewModel, otherwise I will define it here or in Core.

namespace Altigen.Web.ViewComponents
{
    public class SeoViewComponent : ViewComponent
    {
        private readonly UmbracoHelper _umbracoHelper;

        public SeoViewComponent(UmbracoHelper umbracoHelper)
        {
            _umbracoHelper = umbracoHelper;
        }

        public IViewComponentResult Invoke(IPublishedContent? content = null)
        {
            // If no content passed, try to use assigned content item
            content ??= _umbracoHelper.AssignedContentItem;

            if (content == null)
            {
                return Content(string.Empty);
            }

            var title = GetFallbackValue(content, "seoPageTitle");
            
            // Get Global Settings for Prefix/Suffix
            var globalSettings = _umbracoHelper.ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == "globalSettings");

            if (globalSettings != null && !string.IsNullOrWhiteSpace(title))
            {
                var prefix = globalSettings.Value<string>("globalSeoTitlePrefix");
                var suffix = globalSettings.Value<string>("globalSeoTitleSuffix");

                if (!string.IsNullOrWhiteSpace(prefix))
                {
                    title = $"{prefix}{title}"; // Assuming space separator, user didn't specify but standard practice
                }

                if (!string.IsNullOrWhiteSpace(suffix))
                {
                    title = $"{title}{suffix}";
                }
            }

            var model = new SeoViewModel
            {
                Title = title,
                Description = GetFallbackValue(content, "seoPageDescription"),
                
                // Base properties
                OgUrl = content.Url(mode: UrlMode.Absolute),
                OgType = "website", 
                OgSiteName = globalSettings?.Name
            };

            // 1. OG Properties (Facebook)
            model.OgTitle = content.Value<string>("ogTitle");
            if (string.IsNullOrWhiteSpace(model.OgTitle)) model.OgTitle = model.Title; // Fallback to Page Title

            model.OgDescription = content.Value<string>("ogDescription");
            if (string.IsNullOrWhiteSpace(model.OgDescription)) model.OgDescription = model.Description; // Fallback to Page Description

            // Image handling helper
            string? ResolveImageUrl(IPublishedContent item, string alias)
            {
                var img = item.Value<MediaWithCrops>(alias);
                return img?.MediaUrl(mode: UrlMode.Absolute);
            }

            model.OgImage = ResolveImageUrl(content, "ogImage");
            
            // Global Fallback for Image if not set on page for OG
            if (string.IsNullOrWhiteSpace(model.OgImage) && globalSettings != null)
            {
                model.OgImage = ResolveImageUrl(globalSettings, "headerSettingsLogoDesktop");
            }

            // 2. Twitter Properties
            model.TwitterCardType = content.Value<string>("twitterCardType");
            if (string.IsNullOrWhiteSpace(model.TwitterCardType)) model.TwitterCardType = "summary_large_image";

            model.TwitterTitle = content.Value<string>("twitterTitle");
            if (string.IsNullOrWhiteSpace(model.TwitterTitle)) model.TwitterTitle = model.OgTitle; // Fallback to OG Title (which falls back to Page Title)

            model.TwitterDescription = content.Value<string>("twitterDescription");
            if (string.IsNullOrWhiteSpace(model.TwitterDescription)) model.TwitterDescription = model.OgDescription; // Fallback to OG Description

            model.TwitterImage = ResolveImageUrl(content, "twitterImage");
            if (string.IsNullOrWhiteSpace(model.TwitterImage)) model.TwitterImage = model.OgImage; // Fallback to OG Image (which falls back to Global)

            // Twitter Site/Creator
            model.TwitterSite = content.Value<string>("twitterSite");
            model.TwitterCreator = content.Value<string>("twitterCreator");
            
            // Loose fallback for Twitter Site from Home/Global logic if needed
            if (string.IsNullOrWhiteSpace(model.TwitterSite))
            {
                var home = _umbracoHelper.ContentAtRoot().FirstOrDefault() ?? globalSettings;
                if (home != null)
                {
                     var homeSite = home.Value<string>("twitterSite");
                     if (!string.IsNullOrWhiteSpace(homeSite)) model.TwitterSite = homeSite;
                }
            }

            return View(model);
        }

        private string? GetFallbackValue(IPublishedContent content, string alias)
        {
            // 1. Current Page
            var value = content.Value<string>(alias);
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            // 2. Global Settings Node
            var globalSettings = _umbracoHelper.ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == "globalSettings");

            if (globalSettings != null)
            {
                // Map the local alias (e.g. seoPageTitle) to global alias (e.g. globalSeoTitle)
                // Assuming mapping convention or explicit check
                string globalAlias = alias switch
                {
                    "seoPageTitle" => "globalSeoTitle",
                    "seoPageDescription" => "globalSeoDescription",
                    _ => alias
                };
                
                return globalSettings.Value<string>(globalAlias);
            }

            return null;
        }
    }

    public class SeoViewModel
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        
        // Social Media / Sharing
        public string? OgTitle { get; set; }
        public string? OgDescription { get; set; }
        public string? OgImage { get; set; } // Absolute URL
        public string? OgType { get; set; } = "website";
        public string? OgUrl { get; set; }
        public string? OgSiteName { get; set; }
        
        public string? TwitterCardType { get; set; } = "summary_large_image";
        public string? TwitterTitle { get; set; }
        public string? TwitterDescription { get; set; }
        public string? TwitterImage { get; set; }
        public string? TwitterSite { get; set; }
        public string? TwitterCreator { get; set; }
    }
}
