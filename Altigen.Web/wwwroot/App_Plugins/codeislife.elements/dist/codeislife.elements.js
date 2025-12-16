const t = [
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.Buttons.Spacing",
    name: "Spacing Property Editor UI",
    element: () => import("./spacing.element-D8_v4K1R.js"),
    meta: {
      label: "Spacing",
      icon: "icon-autofill",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.Spacing"
    }
  },
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.Buttons.RobotsMeta",
    name: "Robots Meta Property Editor UI",
    element: () => import("./robots-meta.element-NBh3xUUd.js"),
    meta: {
      label: "Robots Meta",
      icon: "icon-search",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.RobotsMeta"
    }
  },
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.TextAlignment",
    name: "Text Alignment Property Editor UI",
    element: () => import("./text-alignment.element-DDOvwkws.js"),
    meta: {
      label: "Text Alignment",
      icon: "icon-autofill",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.TextAlignment",
      settings: {
        properties: [
          {
            alias: "outputType",
            label: "Output Type",
            description: "Select how the spacing value should be output",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Dropdown",
            config: [
              {
                alias: "items",
                value: ["Default (Inline Style)", "Inline Style", "Css Class"]
              },
              {
                alias: "defaultValue",
                value: "Default (Inline Style)"
              }
            ],
            // @ts-ignore
            validation: {
              mandatory: !0
            }
          },
          {
            alias: "leftValue",
            label: "Left Value",
            description: "Value for left alignment (default: left)",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox",
            config: [{ alias: "defaultValue", value: "left" }]
          },
          {
            alias: "centerValue",
            label: "Center Value",
            description: "Value for center alignment (default: center)",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox",
            config: [{ alias: "defaultValue", value: "center" }]
          },
          {
            alias: "rightValue",
            label: "Right Value",
            description: "Value for right alignment (default: right)",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox",
            config: [{ alias: "defaultValue", value: "right" }]
          },
          {
            alias: "justifyValue",
            label: "Justify Value",
            description: "Value for justify alignment (default: justify)",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox",
            config: [{ alias: "defaultValue", value: "justify" }]
          }
        ]
      }
    }
  }
], a = (i, e) => {
  e.registerMany(t);
};
export {
  t as default,
  a as onInit
};
