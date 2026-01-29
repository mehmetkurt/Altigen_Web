using Umbraco.Cms.Core.Models.PublishedContent;

namespace Altigen.Web.Models;

public class FooterViewModel
{
    public required LogoViewModel Logo { get; set; }
    public required string Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public IPublishedContent? PrivacyPolicy { get; set; }
    public IPublishedContent? CookiePolicy { get; set; }
    public IPublishedContent? Gdpr { get; set; }
    public IEnumerable<SocialItem>? SocialIcons { get; set; }
}
