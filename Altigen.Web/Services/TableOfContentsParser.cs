using HtmlAgilityPack;
using System.Text.RegularExpressions;
using Umbraco.Cms.Core;

namespace Altigen.Web.Services
{
    public class TocItem
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int Level { get; set; }
        public List<TocItem> Children { get; set; } = new();
    }

    public class TocResult
    {
        public string Content { get; set; } = string.Empty;
        public List<TocItem> Items { get; set; } = new();
    }

    public static class TableOfContentsParser
    {
        public static TocResult Parse(string html)
        {
            var result = new TocResult { Content = html };

            if (string.IsNullOrWhiteSpace(html))
                return result;

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var headers = doc.DocumentNode.SelectNodes("//h2|//h3");
            if (headers == null || !headers.Any())
                return result;

            var items = new List<TocItem>();

            foreach (var header in headers)
            {
                var title = header.InnerText.Trim();
                if (string.IsNullOrEmpty(title)) continue;

                var id = header.GetAttributeValue("id", string.Empty);
                if (string.IsNullOrEmpty(id))
                {
                    id = GenerateSlug(title);
                    header.SetAttributeValue("id", id);
                }

                var level = int.Parse(header.Name.Substring(1));
                var item = new TocItem
                {
                    Id = id,
                    Title = title,
                    Level = level
                };

                // Simple flat list for now, view can handle nesting logic or we can enhance here
                // For a robust TOC, flat list with levels is often easier to iterate in Razor
                items.Add(item);
            }

            result.Content = doc.DocumentNode.OuterHtml;
            result.Items = items;

            return result;
        }

        private static string GenerateSlug(string phrase)
        {
            var str = phrase.ToLowerInvariant();
            // Remove invalid chars
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // Convert multiple spaces into one space
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // Cut and trim
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", "-"); 
            return str;
        }
    }
}
