using Altigen.Web.Models;
using Umbraco.Extensions;
using CodeIsLife.Elements.Helpers;
using Microsoft.AspNetCore.Html;
using System.Text;
using Umbraco.Cms.Core.Models.PublishedContent;
using System.Text.Json;

namespace Altigen.Web.Extensions
{
    public static class BlockSettingsExtensions
    {
        /// <summary>
        /// Generates inline styles for Margin, Padding, and Border.
        /// </summary>
        public static IHtmlContent GetBlockStyles(this IPublishedElement? settings, bool renderAttribute = false)
        {
            if (settings == null) return HtmlString.Empty;

            // Legacy support: Calculate 'base' styles using the original logic which treats everything as a simple value
            // However, to share logic, we can call GetResponsiveBlockStyles and only take 'base' + 'desktop' merged?
            // No, strictly speaking, legacy GetBlockStyles was just dumping properties.
            // If the property value IS now a JSON object {desktop:..., mobile:...}, existing GetSpacingStyle might fail or return null.
            // We should ensure GetBlockingStyles returns a flattened string for inline style usage if needed (though we're removing inline styles).
            // For now, let's keep GetBlockStyles simple or redirect to the new logic if possible, 
            // but the request is to separate generating classes.
            // Let's implement GetBlockStyles as "Base" style for backward compatibility if it's called.
            
            var responsiveStyles = GetResponsiveBlockStyles(settings);
            
            // If we are asked for inline styles, we arguably only want the BASE styles (mobile/default) 
            // or we can't really represent responsive styles in inline style attribute.
            // So we return 'base'.
            
            if (responsiveStyles.TryGetValue("base", out var baseStyle))
            {
                var styles = baseStyle.ToString().Trim();
                 if (renderAttribute)
                {
                    if (string.IsNullOrEmpty(styles)) return HtmlString.Empty;
                    return new HtmlString($"style=\"{styles}\"");
                }
                return new HtmlString(styles);
            }

            return HtmlString.Empty;
        }

        public static Dictionary<string, StringBuilder> GetResponsiveBlockStyles(this IPublishedElement? settings)
        {
            var styles = new Dictionary<string, StringBuilder>
            {
                { "base", new StringBuilder() },
                { "tablet", new StringBuilder() },
                { "desktop", new StringBuilder() }
            };

            if (settings == null) return styles;

            // Process properties
            ProcessResponsiveValue(settings, "margin", (val, sb) => {
                var s = ElementStyleHelper.GetSpacingStyle(val, "margin");
                AppendStyle(sb, s);
            }, styles);

            ProcessResponsiveValue(settings, "padding", (val, sb) => {
                var s = ElementStyleHelper.GetSpacingStyle(val, "padding");
                AppendStyle(sb, s);
            }, styles);

            ProcessResponsiveValue(settings, "fontSize", (val, sb) => {
                var s = ElementStyleHelper.GetEnabledValue(val);
                if (!string.IsNullOrEmpty(s) && !IsZeroValue(s)) sb.Append($"font-size: {s} !important; ");
            }, styles);

            ProcessResponsiveValue(settings, "fontColor", (val, sb) => {
                var s = ElementStyleHelper.GetColorStyle(val);
                AppendStyle(sb, s);
            }, styles);

            ProcessResponsiveValue(settings, "borderRadius", (val, sb) => {
                var s = ElementStyleHelper.GetBorderRadiusStyle(val);
                AppendStyle(sb, s);
            }, styles);

            ProcessResponsiveValue(settings, "width", (val, sb) => {
                var s = ElementStyleHelper.GetEnabledValue(val);
                if (!string.IsNullOrEmpty(s)) sb.Append($"width: {s} !important; ");
            }, styles);

            ProcessResponsiveValue(settings, "height", (val, sb) => {
                var s = ElementStyleHelper.GetEnabledValue(val);
                if (!string.IsNullOrEmpty(s)) sb.Append($"height: {s} !important; ");
            }, styles);

            // Responsive Border Implementation
            var borderStyleValue = settings.Value("borderStyle");
            var borderStyle = ElementStyleHelper.GetString(borderStyleValue);
            var borderSizeRaw = settings.Value("borderSize");

            // Validating borderStyle - Fallback to 'solid' if size exists but style is missing
            if ((string.IsNullOrEmpty(borderStyle) || borderStyle.Equals("none", StringComparison.OrdinalIgnoreCase)) && borderSizeRaw != null)
            {
                 var strSize = borderSizeRaw.ToString();
                 // Check if we have a potentially valid size structure (not empty JSON or empty string)
                 if (!string.IsNullOrEmpty(strSize) && strSize != "{}" && strSize != "null")
                 {
                     // If style was specifically 'none' but size is present, user might expect no border, 
                     // but usually 'none' is default. If size is explicitly set, we often want a border.
                     // However, if user explicitly picked 'none', we should probably respect it? 
                     // But here we're handling the case where it might be missing/null.
                     if (string.IsNullOrEmpty(borderStyle))
                     {
                        borderStyle = "solid";
                     }
                 }
            }

            // Only proceed if we have a valid border style
            if (!string.IsNullOrEmpty(borderStyle) && !borderStyle.Equals("none", StringComparison.OrdinalIgnoreCase))
            {
                var borderColor = settings.Value<string>("borderColor");
                
                ProcessResponsiveValue(settings, "borderSize", (val, sb) => {
                    var width = ElementStyleHelper.GetEnabledValue(val);
                    if (!string.IsNullOrEmpty(width))
                    {
                        sb.Append($"border-width: {width} !important; ");
                        sb.Append($"border-style: {borderStyle} !important; ");
                        
                        if (!string.IsNullOrEmpty(borderColor))
                        {
                            sb.Append($"border-color: {borderColor} !important; ");
                        }
                    }
                }, styles);
            }

            return styles;
        }

        private static void AppendStyle(StringBuilder sb, string? style)
        {
            if (!string.IsNullOrEmpty(style))
            {
                sb.Append(style);
                if (!style.TrimEnd().EndsWith(';')) sb.Append(';').Append(' ');
                else sb.Append(' ');
            }
        }

        private static void ProcessResponsiveValue(
            IPublishedElement settings, 
            string alias, 
            Action<object, StringBuilder> styleAction, 
            Dictionary<string, StringBuilder> styles)
        {
            var value = settings.Value(alias);
            if (value == null) return;

            JsonElement? jsonRoot = null;
            JsonDocument? doc = null;

            if (value is JsonElement json)
            {
                jsonRoot = json;
            }
            else if (value is string strValue && strValue.TrimStart().StartsWith("{"))
            {
                try
                {
                    // Inspect as JSON
                    doc = JsonDocument.Parse(strValue);
                    jsonRoot = doc.RootElement;
                }
                catch
                {
                    // Not valid JSON, treat as simple string
                }
            }

            if (jsonRoot.HasValue && jsonRoot.Value.ValueKind == JsonValueKind.Object)
            {
                var root = jsonRoot.Value;
                
                // Get raw properties
                JsonElement? mobileVal = root.TryGetProperty("mobile", out var m) && m.ValueKind != JsonValueKind.Null && m.ValueKind != JsonValueKind.Undefined ? m : null;
                JsonElement? tabletVal = root.TryGetProperty("tablet", out var t) && t.ValueKind != JsonValueKind.Null && t.ValueKind != JsonValueKind.Undefined ? t : null;
                JsonElement? desktopVal = root.TryGetProperty("desktop", out var d) && d.ValueKind != JsonValueKind.Null && d.ValueKind != JsonValueKind.Undefined ? d : null;

                bool isResponsive = mobileVal.HasValue || tabletVal.HasValue || desktopVal.HasValue;

                if (isResponsive)
                {
                    // Calculate effective values with inheritance (UI Logic: Desktop -> Tablet -> Mobile)
                    // Mobile fallback: Mobile -> Tablet -> Desktop
                    var effectiveMobile = mobileVal ?? tabletVal ?? desktopVal;
                    if (effectiveMobile.HasValue)
                    {
                        styleAction(effectiveMobile.Value, styles["base"]);
                    }

                    // Tablet fallback: Tablet -> Desktop
                    var effectiveTablet = tabletVal ?? desktopVal;
                    if (effectiveTablet.HasValue)
                    {
                        styleAction(effectiveTablet.Value, styles["tablet"]);
                    }

                    // Desktop: explicit only (or effectively explicit)
                    if (desktopVal.HasValue)
                    {
                        styleAction(desktopVal.Value, styles["desktop"]);
                    }
                }
                else
                {
                    // Valid JSON object but no responsive keys? 
                    // Pass the original value (or the root element) to the style action
                    styleAction(value, styles["base"]);
                }
            }
            else
            {
                // Simple value -> Base
                styleAction(value, styles["base"]);
            }

            doc?.Dispose();
        }
        
        private static bool IsZeroValue(string val)
        {
            if (val == "0") return true;
            var normalized = val.Replace("px", "", StringComparison.OrdinalIgnoreCase)
                                .Replace("rem", "", StringComparison.OrdinalIgnoreCase)
                                .Replace("em", "", StringComparison.OrdinalIgnoreCase)
                                .Replace("%", "")
                                .Replace("vw", "", StringComparison.OrdinalIgnoreCase)
                                .Replace("vh", "", StringComparison.OrdinalIgnoreCase)
                                .Trim();

            return float.TryParse(normalized, out var num) && num == 0;
        }

        /// <summary>
        /// Generates Bootstrap alignment classes.
        /// </summary>
        public static string GetBlockAlignmentClass(this IPublishedElement? settings)
        {
            var fontAlignment = settings?.Value("fontAlignment");
            if (fontAlignment != null)
            {
                var align = ElementStyleHelper.GetAlignmentContent(fontAlignment);
                if (string.IsNullOrEmpty(align)) return string.Empty;

                return align.ToLowerInvariant() switch
                {
                    "left" => "text-start",
                    "center" => "text-center",
                    "right" => "text-end",
                    "justify" => "text-justify",
                    _ => align
                };
            }
            return string.Empty;
        }
    }
}
