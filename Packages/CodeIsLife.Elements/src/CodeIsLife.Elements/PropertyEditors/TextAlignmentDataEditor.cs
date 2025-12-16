using Umbraco.Cms.Core;
using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.TextAlignment",
    ValueType = ValueTypes.Json,
    ValueEditorIsReusable = true)]  
public class TextAlignmentDataEditor : DataEditor
{
    public TextAlignmentDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
