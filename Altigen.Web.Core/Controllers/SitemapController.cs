using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml.Linq;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Extensions;


namespace Altigen.Web.Core.Controllers
{
    public class SitemapController : UmbracoController
    {
        private readonly UmbracoHelper _umbracoHelper;
        private readonly IUmbracoContextFactory _umbracoContextFactory;

        public SitemapController(UmbracoHelper umbracoHelper, IUmbracoContextFactory umbracoContextFactory)
        {
            _umbracoHelper = umbracoHelper;
            _umbracoContextFactory = umbracoContextFactory;
        }

        [HttpGet]
        public IActionResult Index()
        {
            using (var contextReference = _umbracoContextFactory.EnsureUmbracoContext())
            {
                var rootNodes = _umbracoHelper.ContentAtRoot().Where(x => x.IsVisible()).ToList();

                if (rootNodes == null || !rootNodes.Any())
                {
                    return NotFound();
                }

                XNamespace xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9";
                XNamespace xhtml = "http://www.w3.org/1999/xhtml";

                var urlSet = new XElement(xmlns + "urlset",
                    new XAttribute(XNamespace.Xmlns + "xhtml", xhtml)
                );

                foreach (var rootNode in rootNodes)
                {
                    AddNodeToSitemap(rootNode, urlSet, xmlns, xhtml);

                    // Recursive lookup
                    foreach (var descendant in rootNode.Descendants())
                    {
                        AddNodeToSitemap(descendant, urlSet, xmlns, xhtml);
                    }
                }

                var xml = new XDocument(
                    new XDeclaration("1.0", "utf-8", "yes"),
                    new XProcessingInstruction("xml-stylesheet", "type=\"text/xsl\" href=\"/sitemap.xsl\""),
                    urlSet
                );
                return Content(xml.ToString(), "text/xml", Encoding.UTF8);
            }
        }

        private void AddNodeToSitemap(IPublishedContent node, XElement urlSet, XNamespace xmlns, XNamespace xhtml)
        {
            // Only add if it uses the Sitemap composition
            // Only add if it uses the Sitemap composition
            // Use alias check to avoid circular dependency with generated models
            if (!node.ContentType.CompositionAliases.Contains("sitemap") && !node.ContentType.Alias.Equals("sitemap", StringComparison.OrdinalIgnoreCase)) return;

            // Standard visibility check (Umbraco 'umbracoNaviHide' etc handled by Visible check usually, 
            // but for composition we might want explicit check if we had properties)
            // Explicitly check for sitemapHide property
            if (node.Value<bool>("sitemapHide")) return;

            var url = node.Url(mode: UrlMode.Absolute);

            // Should verify URL is valid (not # or empty)
            if (string.IsNullOrWhiteSpace(url) || url == "#") return;

            var lastMod = node.UpdateDate.ToString("yyyy-MM-ddTHH:mm:sszzz");

            var urlElement = new XElement(xmlns + "url",
                new XElement(xmlns + "loc", url),
                new XElement(xmlns + "lastmod", lastMod)
            );

            // Add ChangeFreq if present
            var changeFreq = node.Value<string>("sitemapChangeFreq");
            if (!string.IsNullOrWhiteSpace(changeFreq))
            {
                urlElement.Add(new XElement(xmlns + "changefreq", changeFreq));
            }

            // Add Priority if present
            var priority = node.Value<decimal?>("sitemapPriority");
            if (priority.HasValue)
            {
                urlElement.Add(new XElement(xmlns + "priority", priority.Value.ToString("0.0", System.Globalization.CultureInfo.InvariantCulture)));
            }
            
            // Handle cultures if Allow Vary By Culture is true for the node
            if (node.Cultures != null && node.Cultures.Any())
            {
                foreach (var culture in node.Cultures)
                {
                    var cultureUrl = node.Url(culture.Key, UrlMode.Absolute);
                    if (!string.IsNullOrWhiteSpace(cultureUrl))
                    {
                        urlElement.Add(new XElement(xhtml + "link",
                            new XAttribute("rel", "alternate"),
                            new XAttribute("hreflang", culture.Key),
                            new XAttribute("href", cultureUrl)
                        ));
                    }
                }
            }

            urlSet.Add(urlElement);
        }
    }
}
