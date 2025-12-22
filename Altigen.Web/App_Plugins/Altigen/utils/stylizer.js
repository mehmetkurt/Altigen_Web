
export class AltigenStylizer {

    /**
     * Parsing JSON input helper
     * @param {string|object} input 
     * @returns {object|string|null}
     */
    static parseJson(input) {
        if (!input) return null;
        if (typeof input === 'object') return input;
        try {
            return JSON.parse(input);
        } catch {
            return input; // Return raw string on failure
        }
    }

    /**
     * Get CSS classes for alignment
     * @param {object} settings 
     * @returns {string} Space separated classes
     */
    static getAlignmentClass(settings) {
        const alignment = settings?.FontAlignment || settings?.fontAlignment || settings?.Alignment || settings?.alignment;
        if (alignment) {
            const alignObj = this.parseJson(alignment);
            if (alignObj && alignObj.type === "Css Class" && alignObj.value) {
                return alignObj.value;
            }
        }
        return "";
    }

    /**
     * Get Inline Style for alignment
     * @param {object} settings 
     * @returns {string|null}
     */
    static getAlignmentStyle(settings) {
        const alignment = settings?.FontAlignment || settings?.fontAlignment || settings?.Alignment || settings?.alignment;
        if (alignment) {
            const alignObj = this.parseJson(alignment);
            if (alignObj && (!alignObj.type || alignObj.type === "Default (Inline Style)") && alignObj.value) {
                return `text-align: ${alignObj.value} !important`;
            }
        }
        return null;
    }

    /**
     * Get Border Styles
     * @param {object} settings 
     * @returns {string|null} CSS string
     */
    static getBorderStyles(settings) {
        const borderStyleRaw = settings?.borderStyle || settings?.BorderStyle;
        let borderStyle = null;

        if (borderStyleRaw) {
             const parsed = this.parseJson(borderStyleRaw);
             if (typeof parsed === 'string') {
                 borderStyle = parsed;
             } else if (parsed && typeof parsed === 'object') {
                 if (Array.isArray(parsed) && parsed.length > 0) {
                     borderStyle = parsed[0]?.value || parsed[0];
                 } else if (parsed.value) {
                     borderStyle = parsed.value;
                 }
             }
        }

        if (!borderStyle || borderStyle.toLowerCase() === 'none') return null;

        const borderColor = settings?.borderColor || settings?.BorderColor || '';
        const colorPart = borderColor ? ` ${borderColor}` : '';
        
        const borderSizeRaw = settings?.borderSize || settings?.BorderSize;
        if (borderSizeRaw) {
            const borderSize = this.parseJson(borderSizeRaw);
            if (borderSize && typeof borderSize === 'object') {
                 const { top, right, bottom, left, unit = "px" } = borderSize;
                 
                 if (top || right || bottom || left) {
                     const t = top || '0';
                     const r = right || '0';
                     const b = bottom || '0';
                     const l = left || '0';

                     // Optimization: All equal
                     if (t === r && t === b && t === l) {
                         return `border: ${t}${unit} ${borderStyle}${colorPart} !important`;
                     }

                     const styles = [];
                     if (top) styles.push(`border-top: ${t}${unit} ${borderStyle}${colorPart} !important`);
                     if (right) styles.push(`border-right: ${r}${unit} ${borderStyle}${colorPart} !important`);
                     if (bottom) styles.push(`border-bottom: ${b}${unit} ${borderStyle}${colorPart} !important`);
                     if (left) styles.push(`border-left: ${l}${unit} ${borderStyle}${colorPart} !important`);
                     if (styles.length > 0) return styles.join("; ");
                 }
            }
        }

        // Fallback
        const styles = [`border-style: ${borderStyle} !important`];
        if (borderColor) styles.push(`border-color: ${borderColor} !important`);
        styles.push(`border-width: 1px !important`);
        return styles.join("; ");
    }

    /**
     * Get Border Radius Styles
     * @param {object} settings 
     * @returns {string|null}
     */
    static getBorderRadiusStyles(settings) {
        const radiusRaw = settings?.borderRadius || settings?.BorderRadius;
        if (!radiusRaw) return null;

        const radius = this.parseJson(radiusRaw);
        if (!radius) {
             if (typeof radiusRaw === 'string' && !radiusRaw.trim().startsWith('{')) {
                 return `border-radius: ${radiusRaw} !important`;
             }
             return null;
        }

        if (typeof radius === 'string') {
            return `border-radius: ${radius} !important`;
        }

        const { topLeft, topRight, bottomRight, bottomLeft, unit = "px" } = radius;
        const hasTL = !!topLeft;
        const hasTR = !!topRight;
        const hasBR = !!bottomRight;
        const hasBL = !!bottomLeft;

        if (!hasTL && !hasTR && !hasBR && !hasBL) return null;

        // Shorthand logic
        if (hasTL && hasTR && hasBR && hasBL) {
             const tl = topLeft || '0';
             const tr = topRight || '0';
             const br = bottomRight || '0';
             const bl = bottomLeft || '0';
             
             if (tl === tr && tl === br && tl === bl) {
                 return `border-radius: ${tl}${unit} !important`;
             }
             return `border-radius: ${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit} !important`;
        }

        const styles = [];
        if (hasTL) styles.push(`border-top-left-radius: ${topLeft}${unit} !important`);
        if (hasTR) styles.push(`border-top-right-radius: ${topRight}${unit} !important`);
        if (hasBR) styles.push(`border-bottom-right-radius: ${bottomRight}${unit} !important`);
        if (hasBL) styles.push(`border-bottom-left-radius: ${bottomLeft}${unit} !important`);

        return styles.join("; ");
    }

    /**
     * Get Font Size Style
     * @param {object} settings 
     * @returns {string|null}
     */
    static getFontSizeStyle(settings) {
        const fontSizeRaw = settings?.size || settings?.fontSize || settings?.Size;
        if (!fontSizeRaw) return null;

        const fontSizeObj = this.parseJson(fontSizeRaw);
        let fontSizeVal = fontSizeRaw;
        let enabled = true;

        if (fontSizeObj && typeof fontSizeObj === 'object' && fontSizeObj.value !== undefined) {
            fontSizeVal = fontSizeObj.value;
            enabled = fontSizeObj.enabled !== false;
        }

        if (enabled && fontSizeVal) {
             const stringVal = String(fontSizeVal).trim();
             if (stringVal && stringVal !== "0" && !stringVal.startsWith("0")) {
                 return `font-size: ${stringVal} !important`;
             }
        }
        return null;
    }

    /**
     * Get Font Color Style
     * @param {object} settings 
     * @returns {string|null}
     */
    static getFontColorStyle(settings) {
        const colorRaw = settings?.fontColor || settings?.FontColor || settings?.color || settings?.Color;
        if (!colorRaw) return null;

        const colorObj = this.parseJson(colorRaw);
        let colorVal = null;

        if (typeof colorObj === 'string') {
            colorVal = colorObj;
        } else if (colorObj && typeof colorObj === 'object') {
            colorVal = colorObj.value || colorObj.Color || colorObj.color; 
        }

        if (colorVal && typeof colorVal === 'string' && !colorVal.startsWith('{')) {
             return `color: ${colorVal} !important`;
        }
        return null;
    }

    /**
     * Get Spacing Style (Margin/Padding)
     * @param {string|object} input 
     * @param {string} prefix 
     * @returns {string|null}
     */
    static getSpacingStyle(input, prefix) {
        if (!input) return null;
        
        const spacing = this.parseJson(input);
        if (!spacing) return null;

        const { top, right, bottom, left, unit = "px" } = spacing;
        
        const hasT = !!top;
        const hasR = !!right;
        const hasB = !!bottom;
        const hasL = !!left;

        if (!hasT && !hasR && !hasB && !hasL) return null;

        if (hasT && hasR && hasB && hasL) {
            return `${prefix}: ${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit} !important`;
        }

        const styles = [];
        if (hasT) styles.push(`${prefix}-top: ${top}${unit} !important`);
        if (hasR) styles.push(`${prefix}-right: ${right}${unit} !important`);
        if (hasB) styles.push(`${prefix}-bottom: ${bottom}${unit} !important`);
        if (hasL) styles.push(`${prefix}-left: ${left}${unit} !important`);

        return styles.join("; ");
    }
}
