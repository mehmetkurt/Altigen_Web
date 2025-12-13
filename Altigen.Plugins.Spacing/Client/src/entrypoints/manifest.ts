// UmbExtensionManifest is global

export const manifests: Array<UmbExtensionManifest> = [
    {
        type: 'propertyEditorUi',
        alias: 'Altigen.PropertyEditorUi.Spacing',
        name: 'Spacing UI',
        js: () => import('../property-editor/spacing.element.js'),
        meta: {
            label: 'Spacing (Box Model)',
            icon: 'icon-box',
            group: 'Rich Content',
            propertyEditorSchemaAlias: 'Altigen.PropertyEditor.Spacing'
        }
    }
];
