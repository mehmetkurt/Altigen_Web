using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.Length",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class LengthDataEditor : DataEditor
{
    public LengthDataEditor(
        IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
