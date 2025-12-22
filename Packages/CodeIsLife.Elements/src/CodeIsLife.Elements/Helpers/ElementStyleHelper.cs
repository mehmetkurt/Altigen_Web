using System.Text.Json;
using Umbraco.Cms.Core.Models.Blocks;

namespace CodeIsLife.Elements.Helpers
{
    /// <summary>
    /// Helper class for retrieving and formatting inline styles and CSS classes from BlockListItem settings.
    /// Provides methods for handling spacing, alignment, and custom styling.
    /// </summary>
    public static class ElementStyleHelper
    {
        private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

        /// <summary>
        /// Generates an inline style string for a generic block item, checking width, padding, margin, and custom styles.
        /// </summary>
        /// <param name="item">The block list item.</param>
        /// <returns>A semicolon-separated string of CSS styles.</returns>
        public static string GetItemStyle(BlockListItem item)
        {
            var settings = item.Settings;
            if (settings == null) return string.Empty;

            var styleList = new List<string>();

            // Width
            var width = settings.Value<string>("width");
            if (!string.IsNullOrWhiteSpace(width)) styleList.Add($"width: {width}");

            // Spacing
            var paddingStyle = GetSpacingStyle(settings.Value("padding"), "padding");
            if (!string.IsNullOrWhiteSpace(paddingStyle)) styleList.Add(paddingStyle!);

            var marginStyle = GetSpacingStyle(settings.Value("margin"), "margin");
            if (!string.IsNullOrWhiteSpace(marginStyle)) styleList.Add(marginStyle!);

            // Custom Style
            var customStyle = settings.Value<string>("style");
            if (!string.IsNullOrWhiteSpace(customStyle)) styleList.Add(customStyle);

            return styleList.Any() ? string.Join("; ", styleList) : string.Empty;
        }

        /// <summary>
        /// Generates a CSS class string for a generic block item.
        /// </summary>
        /// <param name="item">The block list item.</param>
        /// <returns>A space-separated string of CSS classes.</returns>
        public static string GetItemClass(BlockListItem item)
        {
            var settings = item.Settings;
            if (settings == null) return string.Empty;

            var classes = new List<string>();

            var cssClass = settings.Value<string>("cssClass");
            if (!string.IsNullOrWhiteSpace(cssClass)) classes.Add(cssClass);

            var isBold = settings.Value<bool>("isBold");
            if (isBold) classes.Add("fw-bold");

            return classes.Any() ? string.Join(" ", classes) : string.Empty;
        }

        /// <summary>
        /// Parses input to generate spacing styles (margin/padding) with support for both shorthand and longhand formats.
        /// </summary>
        /// <param name="input">The raw input value (JSON object or string).</param>
        /// <param name="prefix">The style prefix (e.g., 'margin', 'padding').</param>
        /// <returns>A formatted CSS style string or null if invalid.</returns>
        public static string? GetSpacingStyle(object? input, string prefix)
        {
            if (input == null) return null;

            // Attempt to parse structured JSON
            var spacing = TryParseJson<AdvancedValue>(input);

            // Fallback for raw strings if JSON parsing failed or wasn't applicable
            if (spacing == null)
            {
                var strVal = input.ToString();
                if (!string.IsNullOrWhiteSpace(strVal) && !strVal!.TrimStart().StartsWith("{"))
                {
                    return $"{prefix}: {strVal} !important";
                }
                return null;
            }

            // Destructure spacing properties
            var t = spacing.Top;
            var r = spacing.Right;
            var b = spacing.Bottom;
            var l = spacing.Left;

            bool hasT = !string.IsNullOrWhiteSpace(t);
            bool hasR = !string.IsNullOrWhiteSpace(r);
            bool hasB = !string.IsNullOrWhiteSpace(b);
            bool hasL = !string.IsNullOrWhiteSpace(l);

            // 1. Return null if all are empty
            if (!hasT && !hasR && !hasB && !hasL) return null;

            var unit = string.IsNullOrEmpty(spacing.Unit) ? "px" : spacing.Unit;

            // 2. Optimization: Shorthand if all sides are present
            if (hasT && hasR && hasB && hasL)
            {
                return $"{prefix}: {t}{unit} {r}{unit} {b}{unit} {l}{unit} !important";
            }

            // 3. Longhand: Partial properties
            var styles = new List<string>();
            if (hasT) styles.Add($"{prefix}-top: {t}{unit} !important");
            if (hasR) styles.Add($"{prefix}-right: {r}{unit} !important");
            if (hasB) styles.Add($"{prefix}-bottom: {b}{unit} !important");
            if (hasL) styles.Add($"{prefix}-left: {l}{unit} !important");

            return string.Join("; ", styles);
        }

        /// <summary>
        /// Parses input to generate border-radius styles with support for individual corners and shorthand.
        /// </summary>
        /// <param name="input">The raw input value (JSON object or string).</param>
        /// <returns>A formatted CSS style string or null if invalid.</returns>
        public static string? GetBorderRadiusStyle(object? input)
        {
            if (input == null) return null;

            // Attempt to parse structured JSON
            var radius = TryParseJson<BorderRadiusValue>(input);

            // Fallback for raw strings
            if (radius == null)
            {
                var strVal = input.ToString();
                if (!string.IsNullOrWhiteSpace(strVal) && !strVal!.TrimStart().StartsWith("{"))
                {
                    return $"border-radius: {strVal} !important";
                }
                return null;
            }

            var tl = radius.TopLeft;
            var tr = radius.TopRight;
            var br = radius.BottomRight;
            var bl = radius.BottomLeft;

            bool hasTL = !string.IsNullOrWhiteSpace(tl);
            bool hasTR = !string.IsNullOrWhiteSpace(tr);
            bool hasBR = !string.IsNullOrWhiteSpace(br);
            bool hasBL = !string.IsNullOrWhiteSpace(bl);

            if (!hasTL && !hasTR && !hasBR && !hasBL) return null;

            var unit = string.IsNullOrEmpty(radius.Unit) ? "px" : radius.Unit;

            // Optimization: Shorthand if all corners are present
            if (hasTL && hasTR && hasBR && hasBL)
            {
                return $"border-radius: {tl}{unit} {tr}{unit} {br}{unit} {bl}{unit} !important";
            }

            // Individual corners
            var styles = new List<string>();
            if (hasTL) styles.Add($"border-top-left-radius: {tl}{unit} !important");
            if (hasTR) styles.Add($"border-top-right-radius: {tr}{unit} !important");
            if (hasBR) styles.Add($"border-bottom-right-radius: {br}{unit} !important");
            if (hasBL) styles.Add($"border-bottom-left-radius: {bl}{unit} !important");

            return string.Join("; ", styles);
        }

        /// <summary>
        /// Parses input to generate text-alignment styles.
        /// </summary>
        /// <param name="input">The raw input value.</param>
        /// <returns>CSS text-align style string.</returns>
        public static string GetAlignmentStyle(object? input)
        {
            var alignment = ParseAlignment(input);
            if (alignment == null || string.IsNullOrWhiteSpace(alignment.Value)) return string.Empty;

            // If type is "Css Class", styles are not handled here
            if (alignment.Type?.Contains("Css Class", StringComparison.OrdinalIgnoreCase) == true) return string.Empty;

            return $"text-align: {alignment.Value} !important";
        }

        /// <summary>
        /// Parses input to generate text-alignment CSS classes.
        /// </summary>
        /// <param name="input">The raw input value.</param>
        /// <returns>CSS class string if type is 'Css Class'.</returns>
        public static string GetAlignmentClass(object? input)
        {
            var alignment = ParseAlignment(input);
            if (alignment == null || string.IsNullOrWhiteSpace(alignment.Value)) return string.Empty;

            if (alignment.Type?.Contains("Css Class", StringComparison.OrdinalIgnoreCase) == true) return alignment.Value!;

            return string.Empty;
        }

        /// <summary>
        /// Gets the raw alignment value content.
        /// </summary>
        /// <param name="input">The raw input value.</param>
        /// <returns>Alignment value string.</returns>
        public static string GetAlignmentContent(object? input)
        {
            var alignment = ParseAlignment(input);
            return alignment?.Value ?? string.Empty;
        }

        /// <summary>
        /// safely retrieves a string value from a generic input, handling specialized JSON storage formats.
        /// </summary>
        /// <param name="input">The input object.</param>
        /// <returns>Extracted string value.</returns>
        public static string? GetString(object? input)
        {
            if (input == null) return null;
            if (input is string str) return str;

            if (input is JsonDocument doc)
            {
                return ParseJsonElement(doc.RootElement);
            }
            if (input is JsonElement element)
            {
                return ParseJsonElement(element);
            }

            return input.ToString();
        }

        /// <summary>
        /// Retrieves the value from a JSON object that supports an 'enabled' toggle.
        /// Returns null if 'enabled' is false, otherwise returns the 'value' property.
        /// </summary>
        /// <param name="input">The input object.</param>
        /// <returns>The enabled value string or null.</returns>
        public static string? GetEnabledValue(object? input)
        {
            if (input == null) return null;

            try
            {
                // Handle String Input
                if (input is string jsonStr)
                {
                    if (string.IsNullOrWhiteSpace(jsonStr)) return null;

                    var trimmed = jsonStr.TrimStart();
                    if (trimmed.StartsWith("{"))
                    {
                        using var parsedDoc = JsonDocument.Parse(jsonStr);
                        return ParseJsonElement(parsedDoc.RootElement);
                    }
                    return jsonStr; // Simple string (Legacy)
                }

                // Handle JsonDocument
                if (input is JsonDocument doc)
                {
                    return ParseJsonElement(doc.RootElement);
                }

                // Handle JsonElement
                if (input is JsonElement element)
                {
                    return ParseJsonElement(element);
                }
            }
            catch
            {
                // Swallow errors for robustness
            }

            // Fallback for unknown types, prevent leaking Type Names
            var str = input.ToString();
            if (str != null && str.StartsWith("System.")) return null;
            return str;
        }

        // --- Private Helpers ---

        private static AlignmentValue? ParseAlignment(object? input)
        {
            if (input == null) return null;

            // Try generic parsing
            var alignment = TryParseJson<AlignmentValue>(input);
            if (alignment != null) return alignment;

            // Fallback: simple string is treated as Value with default type
            var strVal = input.ToString();
            if (!string.IsNullOrWhiteSpace(strVal) && !strVal!.TrimStart().StartsWith("{"))
            {
                return new AlignmentValue { Value = strVal, Type = "Default (Inline Style)" };
            }

            return null;
        }

        private static T? TryParseJson<T>(object? input) where T : class
        {
            if (input == null) return null;

            try
            {
                if (input is string jsonStr)
                {
                    if (string.IsNullOrWhiteSpace(jsonStr)) return null;
                    if (jsonStr.TrimStart().StartsWith("{"))
                    {
                        return JsonSerializer.Deserialize<T>(jsonStr, _jsonOptions);
                    }
                    return null;
                }

                if (input is JsonElement jsonElement)
                {
                    return jsonElement.Deserialize<T>(_jsonOptions);
                }

                if (input is JsonDocument doc)
                {
                    return doc.RootElement.Deserialize<T>(_jsonOptions);
                }

                // Fallback for other types behaving as JSON strings
                var str = input.ToString();
                if (!string.IsNullOrWhiteSpace(str) && str!.TrimStart().StartsWith("{"))
                {
                    return JsonSerializer.Deserialize<T>(str, _jsonOptions);
                }
            }
            catch
            {
                // Ignore parsing failures
            }

            return null;
        }

        private static string? ParseJsonElement(JsonElement root)
        {
            if (root.ValueKind == JsonValueKind.String) return root.GetString();
            if (root.ValueKind != JsonValueKind.Object) return root.ToString();

            // Check Enabled property
            if (root.TryGetProperty("enabled", out var enabledProp))
            {
                if (enabledProp.ValueKind == JsonValueKind.False) return null;
            }

            // Return Value property
            if (root.TryGetProperty("value", out var valueProp))
            {
                return valueProp.GetString();
            }

            return null;
        }

        // --- Data Classes ---

        private class AdvancedValue
        {
            public string? Top { get; set; }
            public string? Right { get; set; }
            public string? Bottom { get; set; }
            public string? Left { get; set; }
            public string? Unit { get; set; }
        }

        private class BorderRadiusValue
        {
            public string? TopLeft { get; set; }
            public string? TopRight { get; set; }
            public string? BottomRight { get; set; }
            public string? BottomLeft { get; set; }
            public string? Unit { get; set; }
        }

        private class AlignmentValue
        {
            public string? Value { get; set; }
            public string? Type { get; set; }
        }
    }
}
