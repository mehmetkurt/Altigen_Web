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
- **Razor**: Minimal logic; delegate to Services/ViewComponents. Use **Partial Views** and **ViewModels** to encapsulate rendering logic and data structures.

## Content Modeling
Authentication and common page features are handled via a robust inheritance and composition strategy:

### Base Types & Compositions
- **`HomePage` (`homePage`)**: The Root node of the website.
    - **Compositions**: `Seo`, `Sharing`, `Sitemap`, and `Slider` (unique main banner).
    - **Children**: Strictly allows *List* types (`BlogList`, `RegionList`, `ServiceList`) as immediate children.
- **`SubPage` (`subPage`)**: Acts as the foundational Document Type for content pages.
    - **Compositions**: Aggregates `PageHeader` (Titles/Subtitles), `Seo` (Meta tags, Canonical), `Sharing` (OG/Twitter cards), and `Sitemap` (Priority, ChangeFreq).
    - **Usage**: Inherited by specific functional pages (`Blog`, `Region`, `Service`, `BlogCategory`) and their list containers.
- **`PagingList` (`pagingList`)**: Specialized extension of `SubPage` for list views with pagination support.
    - **Compositions**: Inherits `SubPage` compositions + implements `IPaging`.
    - **Usage**: Base class for `BlogList` and used by `BlogCategory`.

### Hierarchy & Relationships
- **List-Item Pattern**: Structured content follows a strict parent-child relationship:
    - `RegionList` -> Children: `Region` (Note: RegionList model not generated, managed dynamically or maps to base List)
    - `ServiceList` -> Children: `Service` (Note: ServiceList model not generated, managed dynamically or maps to base List)
    - `BlogList` -> Children: `BlogCategory` (Strict Mode: BlogList only allows Categories)
    - `BlogCategory` -> Children: `Blog`
- **Variations**:
    - All standard content types vary by **Culture**.


