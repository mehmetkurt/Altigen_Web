using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.RobotsMeta",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class RobotsMetaDataEditor : DataEditor
{
    public RobotsMetaDataEditor(
        IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }

    protected override IDataValueEditor CreateValueEditor() =>
        DataValueEditorFactory.Create<DataValueEditor>(Attribute!);
}
