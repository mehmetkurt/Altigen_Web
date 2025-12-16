using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.Spacing",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class SpacingDataEditor : DataEditor
{
    public SpacingDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
