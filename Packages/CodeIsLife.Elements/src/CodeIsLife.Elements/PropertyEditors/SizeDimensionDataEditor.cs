using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.SizeDimension",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class SizeDimensionDataEditor : DataEditor
{
    public SizeDimensionDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
