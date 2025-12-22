import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { AltigenStylizer } from "../utils/stylizer.js";

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
        const alignmentClass = AltigenStylizer.getAlignmentClass(this.settings);
        if (alignmentClass) classes.push(alignmentClass);
        return classes.join(" ");
    }

    _getStyles() {
        const styles = [];
        
        // Alignment Style (if not class)
        const alignmentStyle = AltigenStylizer.getAlignmentStyle(this.settings);
        if (alignmentStyle) styles.push(alignmentStyle);

        // Margin
        const margin = AltigenStylizer.getSpacingStyle(this.settings?.margin || this.settings?.Margin, "margin");
        if (margin) styles.push(margin);

        // Padding
        const padding = AltigenStylizer.getSpacingStyle(this.settings?.padding || this.settings?.Padding, "padding");
        if (padding) styles.push(padding);

        // Font Size
        const fontSize = AltigenStylizer.getFontSizeStyle(this.settings);
        if (fontSize) styles.push(fontSize);

        // Border
        const border = AltigenStylizer.getBorderStyles(this.settings);
        if (border) styles.push(border);

        // Border Radius
        const borderRadius = AltigenStylizer.getBorderRadiusStyles(this.settings);
        if (borderRadius) styles.push(borderRadius);

        return styles.join("; ");
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
