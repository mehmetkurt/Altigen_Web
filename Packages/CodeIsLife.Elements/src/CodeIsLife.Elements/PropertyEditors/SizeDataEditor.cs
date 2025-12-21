using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.Size",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class SizeDataEditor : DataEditor
{
    private readonly IIOHelper _ioHelper;

    public SizeDataEditor(
        IDataValueEditorFactory dataValueEditorFactory,
        IIOHelper ioHelper)
        : base(dataValueEditorFactory)
    {
        _ioHelper = ioHelper;
    }

    protected override IConfigurationEditor CreateConfigurationEditor() => new SizeConfigurationEditor(_ioHelper);
}

public class SizeConfigurationEditor : ConfigurationEditor<SizeConfiguration>
{
    public SizeConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
    {
    }
}

public class SizeConfiguration
{
    [ConfigurationField("min")]
    public int Min { get; set; } = 0;

    [ConfigurationField("max")]
    public int Max { get; set; } = 100;

    [ConfigurationField("step")]
    public int Step { get; set; } = 1;

    [ConfigurationField("showToggle")]
    public bool ShowToggle { get; set; } = false;
}
