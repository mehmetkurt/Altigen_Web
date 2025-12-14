const o = [
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
  }
], i = (t, e) => {
  e.registerMany(o);
};
export {
  o as default,
  i as onInit
};
