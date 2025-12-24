import { LitElement, html, css, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { AltigenStylizer } from "../utils/altigen-style-helper.js";
import { UmbImagingRepository } from '@umbraco-cms/backoffice/imaging';

export default class AltigenImageBlock extends UmbElementMixin(LitElement) {
    
    #imagingRepository = new UmbImagingRepository(this);

    constructor() {
        super();
        this._imageUrl = "";
        console.log("AltigenImageBlock initialized v1.7 - Reactivity Fix");
    }

    static get properties() {
        return {
            content: { attribute: false },
            settings: { attribute: false },
             _imageUrl: { state: true }
        };
    }

    async updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('content')) {
            await this.#resolveImage();
        }
    }

    async #resolveImage() {
        const imageProp = this.content?.imageBlockImage?.[0] || this.content?.ImageBlockImage?.[0];
        
        if (imageProp?.mediaKey) {
            try {
                // Use UmbImagingRepository with explicit dimensions
                const { data } = await this.#imagingRepository.requestThumbnailUrls([imageProp.mediaKey], 300, 300);
                
                if (data && data.length > 0 && data[0].url) {
                    this._imageUrl = data[0].url;
                } else {
                     // console.warn("Imaging Data returned empty or no URL:", data);
                }
            } catch (e) {
                console.error("Error resolving image URL via ImagingRepo:", e);
            }
        } else {
            this._imageUrl = "";
        }
    }

    render() {
        // Safe access to content properties (handling PascalCase from server / camelCase from client)
        // console.log("ImageBlock Content:", this.content); // Debug disabled
        const altText = this.content?.imageBlockAltText || this.content?.ImageBlockAltText || "";
        const title = this.content?.imageBlockTitle || this.content?.ImageBlockTitle || "";
        
        // Dimensions from Settings
        const width = AltigenStylizer.getDimensionStyle(this.settings?.width || this.settings?.Width, "width");
        const height = AltigenStylizer.getDimensionStyle(this.settings?.height || this.settings?.Height, "height");

        const styles = this._getStyles(width, height);
        const classes = this._getClasses();

        return html`
            <link rel="stylesheet" href="/assets/styles/altigen.css">
            <div class="image-block-preview ${classes}" style="${styles}" title="${title}">
                ${this._imageUrl 
                    ? html`<img src="${this._imageUrl}" alt="${altText}" style="width: 100%; height: auto; display: block;">` 
                    : html`<div class="placeholder">Loading or No Image...</div>`
                }
                <!-- Dimensions are now applied via style, overlay might be redundant or needs separate value retrieval if we want to show it -->
            </div>
        `;
    }

    _getClasses() {
        const classes = ["image-block"];
        const alignmentClass = AltigenStylizer.getAlignmentClass(this.settings);
        if (alignmentClass) classes.push(alignmentClass);
        return classes.join(" ");
    }

    _getStyles(width, height) {
        const styles = [];
        
        if (width) styles.push(width);
        if (height) styles.push(height);

        // Alignment Style
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

        return styles.join("; ");
    }

    static styles = [
        css`
            :host {
                display: block;
                width: 100%;
            }
            .image-block-preview {
                position: relative;
                box-sizing: border-box;
                overflow: hidden;
            }
            .placeholder {
                background: var(--uui-color-surface-alt);
                color: var(--uui-color-text-alt);
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100px;
                font-size: 12px;
                border: 1px dashed var(--uui-color-border);
            }
            .dimension-overlay {
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: rgba(0,0,0,0.6);
                color: white;
                font-size: 10px;
                padding: 2px 4px;
                border-radius: 3px;
                pointer-events: none;
            }
        `
    ];
}

customElements.define('altigen-image-block', AltigenImageBlock);
