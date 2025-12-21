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
    /// <summary>
    /// Controller responsible for generating the XML Sitemap for the website.
    /// </summary>
    public class SitemapController : UmbracoController
    {
        private readonly UmbracoHelper _umbracoHelper;
        private readonly IUmbracoContextFactory _umbracoContextFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="SitemapController"/> class.
        /// </summary>
        /// <param name="umbracoHelper">Helper for querying published content.</param>
        /// <param name="umbracoContextFactory">Factory to ensure an Umbraco context exists.</param>
        public SitemapController(UmbracoHelper umbracoHelper, IUmbracoContextFactory umbracoContextFactory)
        {
            _umbracoHelper = umbracoHelper;
            _umbracoContextFactory = umbracoContextFactory;
        }

        /// <summary>
        /// Generates and returns the Sitemap XML.
        /// </summary>
        /// <returns>An XML Action Result containing the sitemap.</returns>
        [HttpGet]
        public IActionResult Index()
        {
            using (var contextReference = _umbracoContextFactory.EnsureUmbracoContext())
            {
                // Get all visible root nodes (ContentAtRoot returns Published content only)
                // We remove .Where(x => x.IsVisible()) to ensure we traverse roots even if hidden from nav
                var rootNodes = _umbracoHelper.ContentAtRoot().ToList();

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
                    Traverse(rootNode, urlSet, xmlns, xhtml);
                }

                var xml = new XDocument(
                    new XDeclaration("1.0", "utf-8", "yes"),
                    new XProcessingInstruction("xml-stylesheet", "type=\"text/xsl\" href=\"/sitemap.xsl\""),
                    urlSet
                );
                return Content(xml.ToString(), "text/xml", Encoding.UTF8);
            }
        }

        /// <summary>
        /// Recursively traverses the content tree starting from the given node.
        /// </summary>
        /// <param name="node">The current content node.</param>
        /// <param name="urlSet">The XML element (urlset) to append nodes to.</param>
        /// <param name="xmlns">The Sitemap XML namespace.</param>
        /// <param name="xhtml">The XHTML namespace for alternate links.</param>
        private void Traverse(IPublishedContent node, XElement urlSet, XNamespace xmlns, XNamespace xhtml)
        {
            // Add current node
            AddNodeToSitemap(node, urlSet, xmlns, xhtml);

            // Recursively traverse visible children
            // We iterate ALL children here to filter them inside AddNodeToSitemap based on composition/properties
            // This ensures pages hidden from Nav (umbracoNaviHide) can still appear if they have the sitemap composition
            if (node.Children != null)
            {
                foreach (var child in node.Children)
                {
                    Traverse(child, urlSet, xmlns, xhtml);
                }
            }
        }

        /// <summary>
        /// Validates and adds a single content node to the sitemap XML.
        /// </summary>
        /// <param name="node">The content node to add.</param>
        /// <param name="urlSet">The XML element (urlset) to append to.</param>
        /// <param name="xmlns">The Sitemap XML namespace.</param>
        /// <param name="xhtml">The XHTML namespace for alternate links.</param>
        private void AddNodeToSitemap(IPublishedContent node, XElement urlSet, XNamespace xmlns, XNamespace xhtml)
        {
            // 1. Strict Requirement: Must have 'Sitemap' composition or be the 'Sitemap' doc type
            // Using InvariantCultureIgnoreCase for robustness
            var hasComposition = node.ContentType.CompositionAliases.Any(a => a.Equals("sitemap", StringComparison.InvariantCultureIgnoreCase));
            var isSitemapDoc = node.ContentType.Alias.Equals("sitemap", StringComparison.InvariantCultureIgnoreCase);

            if (!hasComposition && !isSitemapDoc) return;

            // 2. Explicit Hide Check: If sitemapHide is true, skip
            if (node.HasProperty("sitemapHide") && node.Value<bool>("sitemapHide")) return;

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
