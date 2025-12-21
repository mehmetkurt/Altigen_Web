import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

export default class AltigenTitleBlock extends UmbElementMixin(LitElement) {
    
    static get properties() {
        return {
            content: { attribute: false },
            settings: { attribute: false }
        };
    }

    _content;
    set content(newValue) {
        const oldValue = this._content;
        this._content = newValue;
        this.requestUpdate('content', oldValue);
    }
    get content() {
        return this._content;
    }

    _settings;
    set settings(newValue) {
        const oldValue = this._settings;
        this._settings = newValue;
        this.requestUpdate('settings', oldValue);
    }
    get settings() {
        return this._settings;
    }

    render() {
        // Handle both camelCase and PascalCase for robust property access
        const title = this.content?.titleBlockText || this.content?.TitleBlockText || "No Title Set";
        const tagName = this.content?.titleBlockTagType || this.content?.TitleBlockTagType || 'h2';
        
        const styles = this._getStyles();
        const classes = this._getClasses();

        return html`
            <link rel="stylesheet" href="/assets/styles/altigen.css">
            <div class="title-block-preview ${classes}" style="${styles}">
               ${this._renderHeading(tagName, title)}
            </div>
        `;
    }

    _renderHeading(tag, text) {
        switch (tag?.toLowerCase()) {
            case 'h1': return html`<h1>${text}</h1>`;
            case 'h3': return html`<h3>${text}</h3>`;
            case 'h4': return html`<h4>${text}</h4>`;
            case 'h5': return html`<h5>${text}</h5>`;
            case 'h6': return html`<h6>${text}</h6>`;
            case 'h2':
            default: return html`<h2>${text}</h2>`;
        }
    }

    _getClasses() {
        const classes = ["title-block"];
        // Check for FontAlignment or fontAlignment
        const alignment = this.settings?.FontAlignment || this.settings?.fontAlignment || this.settings?.Alignment || this.settings?.alignment; 
        
        if (alignment) {
            const alignObj = this._parseJson(alignment);
            if (alignObj && alignObj.type === "Css Class" && alignObj.value) {
                classes.push(alignObj.value);
            }
        }

        return classes.join(" ");
    }

    _getStyles() {
        const styles = [];
        
        // Alignment
        const alignment = this.settings?.FontAlignment || this.settings?.fontAlignment || this.settings?.Alignment || this.settings?.alignment;
        if (alignment) {
            const alignObj = this._parseJson(alignment);
            // Check for loose equality or specific string match for type
            if (alignObj && (!alignObj.type || alignObj.type === "Default (Inline Style)") && alignObj.value) {
                styles.push(`text-align: ${alignObj.value} !important`);
            }
        }

        // Margin
        const margin = this._getSpacingStyle(this.settings?.margin || this.settings?.Margin, "margin");
        if (margin) styles.push(margin);

        // Padding
        const padding = this._getSpacingStyle(this.settings?.padding || this.settings?.Padding, "padding");
        if (padding) styles.push(padding);

        // Font Size
        const fontSizeRaw = this.settings?.size || this.settings?.fontSize || this.settings?.Size;
        if (fontSizeRaw) {
             const fontSizeObj = this._parseJson(fontSizeRaw);
             let fontSizeVal = fontSizeRaw; // Default to raw if not JSON
             let enabled = true;

             if (fontSizeObj && typeof fontSizeObj === 'object' && fontSizeObj.value !== undefined) {
                 fontSizeVal = fontSizeObj.value;
                 enabled = fontSizeObj.enabled !== false;
             }

             if (enabled && fontSizeVal && fontSizeVal !== "0" && !fontSizeVal.startsWith("0")) {
                 styles.push(`font-size: ${fontSizeVal} !important`);
             }
        }

        return styles.join("; ");
    }

    _getSpacingStyle(input, prefix) {
        if (!input) return null;
        
        const spacing = this._parseJson(input);
        if (!spacing) return null;

        const { top, right, bottom, left, unit = "px" } = spacing;
        
        const hasT = !!top;
        const hasR = !!right;
        const hasB = !!bottom;
        const hasL = !!left;

        if (!hasT && !hasR && !hasB && !hasL) return null;

        // Shorthand
        if (hasT && hasR && hasB && hasL) {
            return `${prefix}: ${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit} !important`;
        }

        // Individual
        const styles = [];
        if (hasT) styles.push(`${prefix}-top: ${top}${unit} !important`);
        if (hasR) styles.push(`${prefix}-right: ${right}${unit} !important`);
        if (hasB) styles.push(`${prefix}-bottom: ${bottom}${unit} !important`);
        if (hasL) styles.push(`${prefix}-left: ${left}${unit} !important`);

        return styles.join("; ");
    }

    _parseJson(input) {
        if (typeof input === 'object') return input;
        try {
            return JSON.parse(input);
        } catch {
            return null;
        }
    }

    static styles = [
        css`
            :host {
                display: block;
                width: 100%;
            }
        `
    ];
}

customElements.define('altigen-title-block', AltigenTitleBlock);
