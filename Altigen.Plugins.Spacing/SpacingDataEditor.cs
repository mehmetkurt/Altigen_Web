using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace Altigen.Plugins.Spacing;

[DataEditor(
    "Altigen.PropertyEditor.Spacing",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class SpacingDataEditor : DataEditor
{
    public SpacingDataEditor(IDataValueEditorFactory dataValueEditorFactory) 
        : base(dataValueEditorFactory)
    {
    }
}
