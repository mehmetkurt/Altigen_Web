using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace CodeIsLife.Elements.PropertyEditors;

[DataEditor(
    "CodeIsLife.AdvancedDropdown",
    ValueType = "JSON",
    ValueEditorIsReusable = true)]
public class AdvancedDropdownDataEditor : DataEditor
{
    private readonly IIOHelper _ioHelper;

    public AdvancedDropdownDataEditor(
        IDataValueEditorFactory dataValueEditorFactory,
        IIOHelper ioHelper)
        : base(dataValueEditorFactory)
    {
        _ioHelper = ioHelper;
    }

    protected override IConfigurationEditor CreateConfigurationEditor() => new AdvancedDropdownConfigurationEditor(_ioHelper);
}

public class AdvancedDropdownConfigurationEditor : ConfigurationEditor<AdvancedDropdownConfiguration>
{
    public AdvancedDropdownConfigurationEditor(IIOHelper ioHelper) : base(ioHelper)
    {
    }
}

public class AdvancedDropdownConfiguration
{
    [ConfigurationField("options")]
    public object? Options { get; set; }

    [ConfigurationField("defaultValue")]
    public string DefaultValue { get; set; } = string.Empty;

    [ConfigurationField("enableFiltering")]
    public bool EnableFiltering { get; set; } = false;
}
