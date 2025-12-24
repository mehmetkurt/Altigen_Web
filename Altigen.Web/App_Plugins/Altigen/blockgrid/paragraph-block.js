import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { AltigenStylizer } from "../utils/altigen-style-helper.js";

export default class AltigenParagraphBlock extends UmbElementMixin(LitElement) {
    
    static get properties() {
        return {
            content: { attribute: false },
            settings: { attribute: false }
        };
    }

    render() {
        const contentVal = this.content?.paragraphBlockContent;
        const content = contentVal?.markup || contentVal || "<p>No Content Set</p>";
        const styles = this._getStyles();
        const classes = this._getClasses();

        return html`
            <link rel="stylesheet" href="/assets/styles/altigen.css">
            <div class="paragraph-block-preview ${classes}" style="${styles}">
               ${unsafeHTML(content)}
            </div>
        `;
    }

    _getClasses() {
        const classes = ["paragraph-block"];
        const alignmentClass = AltigenStylizer.getAlignmentClass(this.settings);
        if (alignmentClass) classes.push(alignmentClass);
        return classes.join(" ");
    }

    _getStyles() {
        const styles = [];
        
        // Alignment
        const alignmentStyle = AltigenStylizer.getAlignmentStyle(this.settings);
        if (alignmentStyle) styles.push(alignmentStyle);

        // Margin
        const margin = AltigenStylizer.getSpacingStyle(this.settings?.margin || this.settings?.Margin, "margin");
        if (margin) styles.push(margin);

        // Padding
        const padding = AltigenStylizer.getSpacingStyle(this.settings?.padding || this.settings?.Padding, "padding");
        if (padding) styles.push(padding);

        // Border
        const border = AltigenStylizer.getBorderStyles(this.settings);
        if (border) styles.push(border);

        // Border Radius
        const borderRadius = AltigenStylizer.getBorderRadiusStyles(this.settings);
        if (borderRadius) styles.push(borderRadius);

        // Font Size
        const fontSize = AltigenStylizer.getFontSizeStyle(this.settings);
        if (fontSize) styles.push(fontSize);

        // Font Color
        const fontColor = AltigenStylizer.getFontColorStyle(this.settings);
        if (fontColor) styles.push(fontColor);

        // Width
        const width = AltigenStylizer.getDimensionStyle(this.settings?.width || this.settings?.Width, "width");
        if (width) styles.push(width);

        // Height
        const height = AltigenStylizer.getDimensionStyle(this.settings?.height || this.settings?.Height, "height");
        if (height) styles.push(height);

        return styles.join("; ");
    }

    static styles = [
        css`
            :host {
                display: block;
                width: 100%;
            }
            .paragraph-block-preview {
                font-family: var(--bs-body-font-family);
                line-height: var(--bs-body-line-height);
                color: var(--bs-body-color);
            }
        `
    ];
}

customElements.define('altigen-paragraph-block', AltigenParagraphBlock);
