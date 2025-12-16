import { LitElement, html, css, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

export default class AltigenTitleBlock extends UmbElementMixin(LitElement) {
    
    static get properties() {
        return {
            content: { attribute: false },
            settings: { attribute: false }
        };
    }

    render() {
        const title = this.content?.titleBlockText || "No Title Set";

        return html`
            <link rel="stylesheet" href="/assets/styles/altigen.css">
            <div class="title-block-preview">
               <h2>${title}</h2>
            </div>
        `;
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
