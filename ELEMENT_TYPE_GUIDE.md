# Element Type & Property Editor Creation Cycle

This guide outlines the steps to create a new Element Type (Property Editor) in the Altigen project.

## 1. Frontend Implementation (Client)

### 1.1 Create the Component
Create a new LitElement component in `Packages/CodeIsLife.Elements/src/CodeIsLife.Elements.Client/src/property-editor/[name]/[name].element.ts`.

```typescript
import { LitElement, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbFormControlMixin } from "@umbraco-cms/backoffice/validation";

@customElement('my-property-editor')
export class MyPropertyEditorElement extends UmbFormControlMixin(LitElement) {
    // Implementation...
}
```

### 1.2 Register in Manifest
Add the component to `Packages/CodeIsLife.Elements/src/CodeIsLife.Elements.Client/src/entrypoints/manifest.ts`. You must register **both** the UI and the Schema.

```typescript
{
    type: 'propertyEditorUi',
    alias: 'My.PropertyEditorUi.Alias',
    name: 'My Property Editor UI',
    element: () => import('../property-editor/my/my.element.js'),
    meta: {
        label: 'My Label',
        propertyEditorSchemaAlias: 'My.PropertyEditor.Alias',
        settings: { /* ... */ }
    }
},
{
    type: 'propertyEditorSchema',
    alias: 'My.PropertyEditor.Alias',
    name: 'My Property Editor Schema',
    meta: {
        defaultPropertyEditorUiAlias: 'My.PropertyEditorUi.Alias'
    }
}
```

## 2. Backend Implementation (Server)

### 2.1 Create Data Editor
Create a C# class in `Packages/CodeIsLife.Elements/src/CodeIsLife.Elements/PropertyEditors/[Name]DataEditor.cs`.

```csharp
using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "My.PropertyEditor.Alias", // Must match Schema Alias
    ValueType = "STRING", // or "JSON"
    ValueEditorIsReusable = true)]
public class MyDataEditor : DataEditor
{
    public MyDataEditor(
        IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
    
    // Optional: CreateConfigurationEditor() if you have settings
}
```

## 3. Build and Verify
1.  **Build** the .NET solution to register the C# Data Editor.
2.  **Run** the project.
3.  Go to **Settings > Data Types**.
4.  Create a new Data Type using your new Property Editor.
5.  Save and verify no errors (like 404).

## 4. Usage
- Add the new Data Type to a Document Type.
- Verify the editor works in the Content section.
