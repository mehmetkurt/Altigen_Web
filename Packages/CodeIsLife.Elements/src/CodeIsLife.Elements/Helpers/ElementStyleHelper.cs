using System.Text.Json;
using Umbraco.Cms.Core.Models.Blocks;

namespace CodeIsLife.Elements.Helpers
{
    public static class ElementStyleHelper
    {
        public static string GetItemStyle(BlockListItem item)
        {
            var settings = item.Settings;
            if (settings == null) return string.Empty;

            var width = settings.Value<string>("width");
            var customStyle = settings.Value<string>("style");

            var styleList = new List<string>();
            if (!string.IsNullOrWhiteSpace(width)) styleList.Add($"width: {width}");

            var paddingStyle = GetSpacingStyle(settings.Value("padding"), "padding");
            if (!string.IsNullOrWhiteSpace(paddingStyle)) styleList.Add(paddingStyle!);

            var marginStyle = GetSpacingStyle(settings.Value("margin"), "margin");
            if (!string.IsNullOrWhiteSpace(marginStyle)) styleList.Add(marginStyle!);

            if (!string.IsNullOrWhiteSpace(customStyle)) styleList.Add(customStyle);

            return styleList.Any() ? string.Join("; ", styleList) : string.Empty;
        }

        public static string GetItemClass(BlockListItem item)
        {
            var settings = item.Settings;
            if (settings == null) return string.Empty;

            var cssClass = settings.Value<string>("cssClass");
            var isBold = settings.Value<bool>("isBold");

            var classes = new List<string>();
            if (isBold) classes.Add("fw-bold");
            if (!string.IsNullOrWhiteSpace(cssClass)) classes.Add(cssClass);

            return classes.Any() ? string.Join(" ", classes) : "";
        }

        /* 
           Helper to parse our Custom Advanced Editor JSON 
           Format: { "top": "10", "right": "20", "bottom": "10", "left": "20", "unit": "px" }
        */
        public static string? GetSpacingStyle(object? input, string prefix)
        {
            if (input == null) return null;

            try
            {
                AdvancedValue? spacing = null;

                if (input is string jsonStr)
                {
                    if (string.IsNullOrWhiteSpace(jsonStr)) return null;
                    if (jsonStr.Trim().StartsWith("{"))
                    {
                        spacing = JsonSerializer.Deserialize<AdvancedValue>(jsonStr);
                    }
                    else
                    {
                        return $"{prefix}: {jsonStr} !important"; // Fallback with important
                    }
                }
                else if (input is JsonDocument doc)
                {
                    spacing = JsonSerializer.Deserialize<AdvancedValue>(doc);
                }
                else
                {
                    // Fallback attempt
                    var str = input.ToString();
                    if (string.IsNullOrWhiteSpace(str)) return null;

                    if (str!.Trim().StartsWith("{"))
                    {
                        spacing = JsonSerializer.Deserialize<AdvancedValue>(str);
                    }
                    else
                    {
                        return $"{prefix}: {str} !important";
                    }
                }

                if (spacing == null) return null;

                var t = spacing.top;
                var r = spacing.right;
                var b = spacing.bottom;
                var l = spacing.left;

                bool hasT = !string.IsNullOrWhiteSpace(t);
                bool hasR = !string.IsNullOrWhiteSpace(r);
                bool hasB = !string.IsNullOrWhiteSpace(b);
                bool hasL = !string.IsNullOrWhiteSpace(l);

                // 1. All Empty -> Return null
                if (!hasT && !hasR && !hasB && !hasL) return null;

                var unit = spacing.unit;
                if (string.IsNullOrEmpty(unit)) unit = "px";

                // 2. All Filled -> Shorthand Optimization
                if (hasT && hasR && hasB && hasL)
                {
                    return $"{prefix}: {t}{unit} {r}{unit} {b}{unit} {l}{unit} !important";
                }

                // 3. Partial -> Longhand (Skip empty)
                var styles = new List<string>();
                if (hasT) styles.Add($"{prefix}-top: {t}{unit} !important");
                if (hasR) styles.Add($"{prefix}-right: {r}{unit} !important");
                if (hasB) styles.Add($"{prefix}-bottom: {b}{unit} !important");
                if (hasL) styles.Add($"{prefix}-left: {l}{unit} !important");

                return string.Join("; ", styles);
            }
            catch
            {
                return null;
            }
        }

        public class AdvancedValue
        {
            public string? top { get; set; }
            public string? right { get; set; }
            public string? bottom { get; set; }
            public string? left { get; set; }
            public string? unit { get; set; }
        }

        public static string GetAlignmentStyle(object? input)
        {
            var alignment = ParseAlignment(input);
            if (alignment == null || string.IsNullOrWhiteSpace(alignment.value)) return string.Empty;

            if (alignment.type?.Contains("Css Class", StringComparison.OrdinalIgnoreCase) == true) return string.Empty;

            return $"text-align: {alignment.value} !important";
        }

        public static string GetAlignmentClass(object? input)
        {
            var alignment = ParseAlignment(input);
            if (alignment == null || string.IsNullOrWhiteSpace(alignment.value)) return string.Empty;

            if (alignment.type?.Contains("Css Class", StringComparison.OrdinalIgnoreCase) == true) return alignment.value;

            return string.Empty;
        }

        public static string GetAlignmentContent(object? input)
        {
            var alignment = ParseAlignment(input);
            if (alignment == null || string.IsNullOrWhiteSpace(alignment.value)) return string.Empty;

            return alignment.value;
        }

        private static AlignmentValue? ParseAlignment(object? input)
        {
            if (input == null) return null;

            try
            {
                if (input is string jsonStr)
                {
                    if (string.IsNullOrWhiteSpace(jsonStr)) return null;
                    if (jsonStr.Trim().StartsWith("{"))
                    {
                        return JsonSerializer.Deserialize<AlignmentValue>(jsonStr, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    }
                    // Legacy fallback: assume it's a value for style
                    return new AlignmentValue { value = jsonStr, type = "Default (Inline Style)" };
                }
                else if (input is JsonElement jsonElement)
                {
                    return JsonSerializer.Deserialize<AlignmentValue>(jsonElement.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (input is JsonDocument doc)
                {
                    return JsonSerializer.Deserialize<AlignmentValue>(doc.RootElement.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else
                {
                     // Fallback for JObject or other types
                     var str = input.ToString();
                     if (string.IsNullOrWhiteSpace(str)) return null;
                     
                     if (str!.Trim().StartsWith("{"))
                     {
                         return JsonSerializer.Deserialize<AlignmentValue>(str, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                     }
                }

                return null;
            }
            catch
            {
                return null;
            }
        }

        public class AlignmentValue
        {
            public string? value { get; set; }
            public string? type { get; set; }
        }
    }
}
