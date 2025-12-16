using Altigen.Web.Models;
using CodeIsLife.Elements.Helpers;
using System.Text;
using System.Text.Json;
using Umbraco.Extensions;

namespace Altigen.Web.Extensions
{
    public static class BlockSettingsExtensions
    {
        /// <summary>
        /// Generates inline styles for Margin, Padding, and Border.
        /// </summary>
        public static string GetBlockStyles(this BlockSettingsModel? settings)
        {
            if (settings == null) return string.Empty;

            var sb = new StringBuilder();

            // Margin
            if (settings.Margin != null)
            {
                var margin = ElementStyleHelper.GetSpacingStyle(settings.Margin, "margin");
                if (!string.IsNullOrEmpty(margin))
                {
                    sb.Append(margin);
                    if (!margin.TrimEnd().EndsWith(";")) sb.Append("; ");
                    else sb.Append(" ");
                }
            }

            // Padding
            if (settings.Padding != null)
            {
                var padding = ElementStyleHelper.GetSpacingStyle(settings.Padding, "padding");
                if (!string.IsNullOrEmpty(padding))
                {
                    sb.Append(padding);
                    if (!padding.TrimEnd().EndsWith(";")) sb.Append("; ");
                    else sb.Append(" ");
                }
            }

            // Border Logic
            GetBorderStyles(settings, sb);

            return sb.ToString().Trim();
        }

        /// <summary>
        /// Generates Bootstrap alignment classes.
        /// </summary>
        public static string GetBlockAlignmentClass(this BlockSettingsModel? settings)
        {
             if (settings?.FontAlignment != null)
             {
                 var align = ElementStyleHelper.GetAlignmentContent(settings.FontAlignment);
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

        private static void GetBorderStyles(BlockSettingsModel settings, StringBuilder sb)
        {
            var borderStyle = settings.BorderStyle;
            
            // Only render border styles if a style (Solid, Dashed, etc.) is selected
            if (!string.IsNullOrEmpty(borderStyle) && !borderStyle.Equals("none", StringComparison.OrdinalIgnoreCase))
            {
                sb.Append($"border-style: {borderStyle};");

                var borderColor = settings.BorderColor;
                if (!string.IsNullOrEmpty(borderColor))
                {
                    // Assuming valid CSS color
                    sb.Append($"border-color: {borderColor};");
                }

                var borderSize = settings.BorderSize;
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

                         string[] sides = { "top", "right", "bottom", "left" };

                         // Optimization: Check if all sides are equal for shorthand? 
                         // For now, explicit definitions are safer.
                         foreach (var side in sides)
                         {
                             if (root.TryGetProperty(side, out var sideProp))
                             {
                                 var val = sideProp.GetString();
                                 if (!string.IsNullOrEmpty(val))
                                 {
                                     sb.Append($"border-{side}-width: {val}{unit};");
                                 }
                             }
                         }
                     }
                     catch { /* Ignore parsing errors */ }
                }
            }
        }
    }
}
