# Tech Context

## Technologies
- **Framework**: .NET 10
- **CMS**: Umbraco 17.0.2
- **Language**: C# (Backend), TypeScript/JavaScript (Frontend/Backoffice), Razor (Views)
- **Styling**: SCSS (Mobile First)
- **Frontend Library**: Vanilla JS, LitElement (for Backoffice extensions)
- **MCP Servers**: `umbraco-mcp` (for direct Umbraco interaction)

## Development Setup
- **OS**: Windows
- **Project Structure**:
    - `Altigen.Web`: Main Umbraco application.
    - `Altigen.Web.Core`: Business logic, services, and core functionality.
    - `Altigen.Web.Models`: Strictly typed models (ModelsBuilder).
    - `Packages`: Custom local packages (e.g., CodeIsLife.Elements).

## Constraints & Preferences
- **No Inline JS**: All JavaScript must be in separate files.
- **Strong Typing**: Use `IPublishedContent` and strongly typed ViewModels.
- **No Console Logs**: Production code must be clean.
- **No HTML Comments**: Do not use `<!-- -->` in Razor views; use `@* *@` if necessary or remove them.
- **Accessibility**: All interactive elements must have discernible text/ARIA labels.
