# System Patterns

## Architecture
Altigen follows a strict separation of concerns:
- **Web Project (`Altigen.Web`)**: Handles HTTP requests, Razor Views, and Backoffice extensions.
- **Core Layer (`Altigen.Web.Core`)**: Contains services, business logic, and extensions. Dependencies flow inwards or laterally, avoiding circular references with the Web project.
- **Models Layer (`Altigen.Web.Models`)**: Defines data structures and strongly typed content models.

## Key Design Decisions
- **Mobile-First Styling**: CSS is written with mobile styles as the default, using `@media (min-width)` for larger screens.
- **Service Repository Pattern**: Business logic is encapsulated in Services (e.g., `BlockStyleService`), preventing logic leakage into Views.
- **Umbraco Extensions**:
    - **Property Editors**: Built using LitElement and TypeScript.
    - **Block Styling**: Centralized service (`BlockStyleService`) to generate CSS for dynamic blocks.

## Naming Conventions
- **C#**: PascalCase for public members, camelCase for private.
- **CSS**: `kebab-case` for classes.
- **Files**: Matching class/component names.

## Code Standards
- **Async/Await**: Universal usage of async patterns.
- **LINQ**: Preferred for collection manipulation.
- **Razor**: Minimal logic; delegate to Services/ViewComponents.
