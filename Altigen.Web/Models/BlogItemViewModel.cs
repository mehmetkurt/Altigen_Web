using Altigen.Web.Models;

namespace Altigen.Web.Models
{
    public class BlogItemViewModel
    {
        public Blog Post { get; set; }
        public string CategorySlug { get; set; }
        public string CategoryName { get; set; }
    }
}
