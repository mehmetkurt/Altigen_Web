import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { unsafeHTML } from "@umbraco-cms/backoffice/external/lit";

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
        const alignment = this.settings?.Alignment || this.settings?.alignment;
        
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
        const alignment = this.settings?.Alignment || this.settings?.alignment;
        if (alignment) {
            const alignObj = this._parseJson(alignment);
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
            .paragraph-block-preview {
                font-family: var(--bs-body-font-family);
                line-height: var(--bs-body-line-height);
                color: var(--bs-body-color);
            }
        `
    ];
}

customElements.define('altigen-paragraph-block', AltigenParagraphBlock);
