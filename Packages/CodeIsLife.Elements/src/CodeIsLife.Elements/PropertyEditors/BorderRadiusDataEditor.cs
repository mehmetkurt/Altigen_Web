using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.BorderRadius", 
    ValueType = "JSON", 
    ValueEditorIsReusable = true)]
public class BorderRadiusDataEditor : DataEditor
{
    public BorderRadiusDataEditor(
        IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
