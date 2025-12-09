using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;

namespace Altigen.Plugins.RobotsMeta;

[DataEditor(
    "Altigen.PropertyEditorSchema.RobotsMeta",
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
        DataValueEditorFactory.Create<DataValueEditor>(Attribute);
}
