namespace Altigen.Web.Models
{
    public class PagingConfigModel
    {
        public int PageSize { get; set; } = 10;
        public int MaxPagerCount { get; set; } = 5;
        public bool ShowFirst { get; set; }
        public bool ShowLast { get; set; }
        public bool ShowNext { get; set; }
        public bool ShowPrev { get; set; }
    }
}
