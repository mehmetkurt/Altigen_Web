// NOT: UmbExtensionManifest global bir tiptir, import etmeye gerek yoktur.

export const manifests: Array<UmbExtensionManifest> = [
    {
        type: 'propertyEditorUi',
        alias: 'Altigen.PropertyEditorUi.RobotsMeta',
        name: 'Robots Meta UI',
        js: () => import('../property-editor/robots-meta.element.js'),
        meta: {
            label: 'Robots Meta',
            icon: 'icon-search',
            group: 'SEO',
            propertyEditorSchemaAlias: 'Altigen.PropertyEditorSchema.RobotsMeta'
        }
    },
    {
        type: 'propertyEditorSchema',
        alias: 'Altigen.PropertyEditorSchema.RobotsMeta',
        name: 'Robots Meta Schema',
        meta: {
            defaultPropertyEditorUiAlias: 'Altigen.PropertyEditorUi.RobotsMeta',
            settings: {
                properties: [
                    {
                        alias: 'options',
                        label: 'Available Options',
                        description: 'Enter options as "Label | Value" (one per line)',
                        propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                    },
                    {
                        alias: 'defaultValues',
                        label: 'Default Values',
                        description: 'Enter default values (comma separated, e.g., index,nofollow)',
                        propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextBox'
                    },
                    {
                        alias: 'exclusionRules',
                        label: 'Exclusion Rules',
                        description: 'Define rules as "Value > Excluded1, Excluded2" (one per line)',
                        propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                    },
                    {
                        alias: 'inclusionRules',
                        label: 'Inclusion Rules',
                        description: 'Define rules as "Value > Included1, Included2" (one per line)',
                        propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                    }
                ]
            }
        }
    }
];