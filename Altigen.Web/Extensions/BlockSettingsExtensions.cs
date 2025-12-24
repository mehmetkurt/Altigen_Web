using Altigen.Web.Models;
using Umbraco.Extensions;
using CodeIsLife.Elements.Helpers;
using Microsoft.AspNetCore.Html;
using System.Text;
using Umbraco.Cms.Core.Models.PublishedContent;

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

            var sb = new StringBuilder();

            // Margin
            var marginVal = settings.Value("margin");
            if (marginVal != null)
            {
                var margin = ElementStyleHelper.GetSpacingStyle(marginVal, "margin");
                if (!string.IsNullOrEmpty(margin))
                {
                    sb.Append(margin);
                    if (!margin.TrimEnd().EndsWith(';')) sb.Append(';').Append(' ');
                    else sb.Append(' ');
                }
            }

            // Padding
            var paddingVal = settings.Value("padding");
            if (paddingVal != null)
            {
                var padding = ElementStyleHelper.GetSpacingStyle(paddingVal, "padding");
                if (!string.IsNullOrEmpty(padding))
                {
                    sb.Append(padding);
                    if (!padding.TrimEnd().EndsWith(';')) sb.Append(';').Append(' ');
                    else sb.Append(' ');
                }
            }

            // Border Logic
            GetBorderStyles(settings, sb);

            // Font Size Logic
            var sizeValue = settings.Value("fontSize");
            var fontSize = ElementStyleHelper.GetEnabledValue(sizeValue);

            if (!string.IsNullOrEmpty(fontSize) && !IsZeroValue(fontSize))
            {
                sb.Append($"font-size: {fontSize} !important; ");
            }

            // Font Color Logic
            var colorValue = settings.Value("fontColor");
            if (colorValue != null)
            {
                var colorStyle = ElementStyleHelper.GetColorStyle(colorValue);
                if (!string.IsNullOrEmpty(colorStyle))
                {
                    sb.Append(colorStyle);
                    if (!colorStyle.TrimEnd().EndsWith(';')) sb.Append(';').Append(' ');
                    else sb.Append(' ');
                }
            }

            // Border Radius Logic
            var radiusValue = settings.Value("borderRadius");
            var borderRadius = ElementStyleHelper.GetBorderRadiusStyle(radiusValue);
            if (!string.IsNullOrEmpty(borderRadius))
            {
                sb.Append(borderRadius);
                if (!borderRadius.TrimEnd().EndsWith(';')) sb.Append(';').Append(' ');
                else sb.Append(' ');
            }

            // Width & Height Logic
            var widthVal = settings.Value("width");
            var width = ElementStyleHelper.GetEnabledValue(widthVal);
            if (!string.IsNullOrEmpty(width))
            {
                sb.Append($"width: {width} !important; ");
            }

            var heightVal = settings.Value("height");
            var height = ElementStyleHelper.GetEnabledValue(heightVal);
            if (!string.IsNullOrEmpty(height))
            {
                sb.Append($"height: {height} !important; ");
            }

            var styles = sb.ToString().Trim();

            if (renderAttribute)
            {
                if (string.IsNullOrEmpty(styles)) return HtmlString.Empty;
                return new HtmlString($"style=\"{styles}\"");
            }

            return new HtmlString(styles);
        }

        private static bool IsZeroValue(string val)
        {
            if (val == "0") return true;
            // Remove common units and check if it parses to 0
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

        private static void GetBorderStyles(IPublishedElement? settings, StringBuilder sb)
        {
            if (settings == null) return;

            // Use generic .Value to avoid JsonDocument casting issues if the underlying storage is simple string
            var borderStyleValue = settings.Value("borderStyle");
            var borderStyle = ElementStyleHelper.GetString(borderStyleValue);

            // Only render border styles if a style (Solid, Dashed, etc.) is selected
            if (!string.IsNullOrEmpty(borderStyle) && !borderStyle.Equals("none", StringComparison.OrdinalIgnoreCase))
            {
                var borderColor = settings.Value<string>("borderColor");
                var colorPart = !string.IsNullOrEmpty(borderColor) ? $" {borderColor}" : "";

                var borderSize = settings.Value<System.Text.Json.JsonDocument>("borderSize");
                if (borderSize != null)
                {
                    try
                    {
                        var root = borderSize.RootElement;
                        string unit = "px";
                        if (root.TryGetProperty("unit", out var unitProp))
                        {
                            unit = unitProp.GetString() ?? "px";
                        }

                        // Get individual values
                        string? top = null, right = null, bottom = null, left = null;

                        if (root.TryGetProperty("top", out var tProp)) top = tProp.GetString();
                        if (root.TryGetProperty("right", out var rProp)) right = rProp.GetString();
                        if (root.TryGetProperty("bottom", out var bProp)) bottom = bProp.GetString();
                        if (root.TryGetProperty("left", out var lProp)) left = lProp.GetString();

                        bool hasTop = !string.IsNullOrEmpty(top);
                        bool hasRight = !string.IsNullOrEmpty(right);
                        bool hasBottom = !string.IsNullOrEmpty(bottom);
                        bool hasLeft = !string.IsNullOrEmpty(left);

                        // Optimization: If all sides are present and equal, use 'border' shorthand
                        if (hasTop && hasRight && hasBottom && hasLeft &&
                            top == right && top == bottom && top == left)
                        {
                            sb.Append($"border: {top}{unit} {borderStyle}{colorPart};");
                            return;
                        }

                        // Otherwise applied per side with shorthand 'border-{side}'
                        if (hasTop) sb.Append($"border-top: {top}{unit} {borderStyle}{colorPart};");
                        if (hasRight) sb.Append($"border-right: {right}{unit} {borderStyle}{colorPart};");
                        if (hasBottom) sb.Append($"border-bottom: {bottom}{unit} {borderStyle}{colorPart};");
                        if (hasLeft) sb.Append($"border-left: {left}{unit} {borderStyle}{colorPart};");

                        return;
                    }
                    catch { /* Ignore parsing errors, fall back to default behavior */ }
                }

                // Fallback: Style and Color without specific widths (defaults to medium width in browser)
                sb.Append($"border-style: {borderStyle};");
                if (!string.IsNullOrEmpty(borderColor))
                {
                    sb.Append($"border-color: {borderColor};");
                }
            }
        }
    }
}
