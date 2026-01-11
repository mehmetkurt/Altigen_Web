using Altigen.Web.Models;

namespace Altigen.Web.Models
{
    public class BlogItemViewModel
    {
        public required Blog Post { get; set; }
        public string CategorySlug { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
    }
}
