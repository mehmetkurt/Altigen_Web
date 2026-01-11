using System;

namespace Altigen.Web.Models
{
    public class PagerViewModel
    {
        public PagingConfigModel Config { get; set; } = new();
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        
        public int TotalPages => Config.PageSize > 0 
            ? (int)Math.Ceiling((double)TotalItems / Config.PageSize) 
            : 0;

        /// <summary>
        /// Base URL for pagination links. (e.g., "?page=" or "/blog?page=")
        /// </summary>
        public string UrlFormat { get; set; } = "?page={0}";
    }
}
