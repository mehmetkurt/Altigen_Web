const i = [
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.Buttons.SizeDimension",
    name: "Size Dimension Property Editor UI",
    element: () => import("./size-dimension.element-BM_E0VaQ.js"),
    meta: {
      label: "Size Dimension",
      icon: "icon-autofill",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.SizeDimension"
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
    element: () => import("./text-alignment.element-CB8gExCJ.js"),
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
            ]
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
  },
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.PropertyEditorUi.AdvancedDropdown",
    name: "Advanced Dropdown Property Editor UI",
    element: () => import("./advanced-dropdown.element-D7N0D9U5.js"),
    meta: {
      label: "Advanced Dropdown",
      icon: "icon-list",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.AdvancedDropdown",
      settings: {
        properties: [
          {
            alias: "options",
            label: "Options",
            description: "Add options. Format: 'Value | Label' or just 'Value'",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.MultipleTextString"
          },
          {
            alias: "defaultValue",
            label: "Default Value",
            description: "The default value to select",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
          }
        ]
      }
    }
  },
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.PropertyEditorUi.Size",
    name: "Size Property Editor UI",
    element: () => import("./size.element-CS-VPNOH.js"),
    meta: {
      label: "Size",
      icon: "icon-font",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.Size",
      settings: {
        properties: [
          {
            alias: "min",
            label: "Minimum Value",
            description: "Minimum value for the slider",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Integer",
            config: [{ alias: "defaultValue", value: 0 }]
          },
          {
            alias: "max",
            label: "Maximum Value",
            description: "Maximum value for the slider",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Integer",
            config: [{ alias: "defaultValue", value: 100 }]
          },
          {
            alias: "step",
            label: "Step",
            description: "Step value for the slider",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Integer",
            config: [{ alias: "defaultValue", value: 1 }]
          },
          {
            alias: "showToggle",
            label: "Show Toggle",
            description: "Show enable/disable toggle for this property",
            propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle",
            config: [{ alias: "defaultValue", value: !1 }]
          }
        ]
      }
    }
  },
  {
    type: "propertyEditorUi",
    alias: "CodeIsLife.PropertyEditorUi.BorderRadius",
    name: "Border Radius Property Editor UI",
    element: () => import("./border-radius.element-zkD7X2xw.js"),
    meta: {
      label: "Border Radius",
      icon: "icon-corners",
      group: "code is life",
      propertyEditorSchemaAlias: "CodeIsLife.BorderRadius"
    }
  },
  {
    type: "propertyEditorSchema",
    alias: "CodeIsLife.BorderRadius",
    name: "Border Radius Property Editor Schema",
    meta: {
      defaultPropertyEditorUiAlias: "CodeIsLife.PropertyEditorUi.BorderRadius"
    }
  },
  {
    type: "propertyEditorSchema",
    alias: "CodeIsLife.Size",
    name: "Size Property Editor Schema",
    meta: {
      defaultPropertyEditorUiAlias: "CodeIsLife.PropertyEditorUi.Size"
    }
  },
  {
    type: "propertyEditorSchema",
    alias: "CodeIsLife.AdvancedDropdown",
    name: "Advanced Dropdown Property Editor Schema",
    meta: {
      defaultPropertyEditorUiAlias: "CodeIsLife.PropertyEditorUi.AdvancedDropdown"
    }
  }
], o = (t, e) => {
  e.registerMany(i);
};
export {
  i as default,
  o as onInit
};
