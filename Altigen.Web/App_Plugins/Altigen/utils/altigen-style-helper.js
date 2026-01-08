
export class AltigenStylizer {

    static {
        console.log("AltigenStylizer v1.2 loaded");
    }


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
     * Resolves the responsive value (defaults to desktop/base)
     * @param {object} input 
     * @returns {object}
     */
    static resolveResponsive(input) {
        if (!input || typeof input !== 'object') return input;
        
        // Check for responsive keys
        if (input.desktop || input.tablet || input.mobile || input.base) {
             return input.desktop || input.base || input.mobile || input.tablet; // Prefer Desktop for preview
        }
        
        return input;
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
            const resolved = this.resolveResponsive(alignObj);
            
            if (resolved && resolved.type === "Css Class" && resolved.value) {
                return resolved.value;
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
            const resolved = this.resolveResponsive(alignObj);
            
            if (resolved && (!resolved.type || resolved.type === "Default (Inline Style)") && resolved.value) {
                return `text-align: ${resolved.value} !important`;
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
             const resolved = this.resolveResponsive(parsed);
             
             if (typeof resolved === 'string') {
                 borderStyle = resolved;
             } else if (resolved && typeof resolved === 'object') {
                 if (Array.isArray(resolved) && resolved.length > 0) {
                     borderStyle = resolved[0]?.value || resolved[0];
                 } else if (resolved.value) {
                     borderStyle = resolved.value;
                 }
             }
        }

        if (!borderStyle || borderStyle.toLowerCase() === 'none') return null;

        const borderColor = settings?.borderColor || settings?.BorderColor || '';
        const colorPart = borderColor ? ` ${borderColor}` : '';
        
        const borderSizeRaw = settings?.borderSize || settings?.BorderSize;
        if (borderSizeRaw) {
            const borderSize = this.parseJson(borderSizeRaw);
            const resolvedSize = this.resolveResponsive(borderSize);
            
            if (resolvedSize && typeof resolvedSize === 'object') {
                 const { top, right, bottom, left, unit = "px" } = resolvedSize;
                 
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
        const resolved = this.resolveResponsive(radius);
        
        if (!resolved) {
             if (typeof radiusRaw === 'string' && !radiusRaw.trim().startsWith('{')) {
                 return `border-radius: ${radiusRaw} !important`;
             }
             return null;
        }

        if (typeof resolved === 'string') {
            return `border-radius: ${resolved} !important`;
        }

        const { topLeft, topRight, bottomRight, bottomLeft, unit = "px" } = resolved;
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
        const resolved = this.resolveResponsive(fontSizeObj);
        
        let fontSizeVal = fontSizeRaw;
        let enabled = true;

        if (resolved && typeof resolved === 'object' && resolved.value !== undefined) {
            fontSizeVal = resolved.value;
            enabled = resolved.enabled !== false;
        } else if (resolved && typeof resolved === 'string') {
            fontSizeVal = resolved;
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
        const resolved = this.resolveResponsive(colorObj);
        
        let colorVal = null;

        if (typeof resolved === 'string') {
            colorVal = resolved;
        } else if (resolved && typeof resolved === 'object') {
            colorVal = resolved.value || resolved.Color || resolved.color; 
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
        const resolved = this.resolveResponsive(spacing);
        
        if (!resolved) return null;

        const { top, right, bottom, left, unit = "px" } = resolved;
        
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
    /**
     * Get Dimension Style (Width/Height)
     * @param {string|object} input 
     * @param {string} property 'width' or 'height'
     * @returns {string|null}
     */
    static getDimensionStyle(input, property) {
        if (!input) return null;
        
        let value = input;
        const obj = this.parseJson(input);
        const resolved = this.resolveResponsive(obj);
        
        if (resolved && typeof resolved === 'object') {
             if (resolved.enabled === false) return null;
             value = resolved.value;
        } else if (resolved) {
            value = resolved;
        }

        if (value) {
             const stringVal = String(value).trim();
             // Prevent "0" or "0px" from adding !important if that creates issues, 
             // but usually explicit 0 width is valid. 
             // Following pattern:
             if (stringVal && !stringVal.startsWith("{")) {
                 return `${property}: ${stringVal} !important`;
             }
        }
        return null;
    }
}
