using System.Collections.Generic;

namespace Altigen.Web.Models
{
    public class LanguageSelectorViewModel
    {
        public LanguageItem CurrentLanguage { get; set; } = new();
        public List<LanguageItem> Languages { get; set; } = new();
    }

    public class LanguageItem
    {
        public string Name { get; set; } = string.Empty;
        public string Culture { get; set; } = string.Empty;
        public string FlagUrl { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
