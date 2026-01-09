# Active Context

## Current Status
The project is in active development (January 2026), focusing on:
1.  **Memory Bank Initialization**: Establishing the documentation structure.
2.  **Backoffice Customization**: Developing custom property editors (`AdvancedDropdown`, `UnitSelector`, etc.).
3.  **Frontend Implementation**: Refining the Block styling service and ensuring accessibility correctness.

## Recent Changes
- Fixed git ignore cache for `Altigen.Web/wwwroot/App_Plugins/codeislife.elements/dist` folder.
- Removed `device-selector.element.ts` due to development issues and lack of control.
- Fixed `BlockSettingsExtensions.cs` to correctly generate responsive border styles based on device settings.
- Refactored `SizeEditor` property JSON parsing.
- Analyzed and documented Content Type inheritance hierarchy for `HomePage`, `SubPage`, `Blog`, `Region`, and `Service` modules.
- Updated `ServiceList` configuration to vary by **Culture**.
- Fixed `NullReferenceException` in `PageHeader` component by explicitly passing the Model in `SubLayout.cshtml` and injecting `IPublishedValueFallback` in `Default.cshtml`.
- Resolved `CS8604` warning in `PageHeader/Default.cshtml` by using null-checked `content` variable for breadcrumb generation.
- Refactored `PageHeader/Default.cshtml` to use strongly typed properties from `ISeo` and `IPageHeader` interfaces, eliminating "magic strings".
- Enforced non-empty `title` attributes for all `<a>` tags for better SEO and Accessibility, updating `PageHeader` breadcrumbs and `GEMINI.md`.
- Refactored `PageHeaderViewComponent` (Manually corrected by User): Reverted to returning View with `IUmbracoContext` content. `Default.cshtml` handles safe usage of `IPageHeader`.
- Refactored `PageHeaderViewComponent` (Manually corrected by User): Reverted to returning View with `IUmbracoContext` content. `Default.cshtml` handles safe usage of `IPageHeader`.
- Identified and fixed missing `@model` directives in `Blog.cshtml` and `BlogList.cshtml` (Manual fix by User).
- Created `IGlobalSettingsService` and `GlobalSettingsService` in `Altigen.Web.Core` to provide centralized access to `GlobalSettings`.
- Registered `GlobalSettingsService` using `ServiceComposer` in `Altigen.Web.Core`.
- Refactored `GlobalSettingsService` to use `UmbracoHelper` for simplifying content access and avoiding `IPublishedContentCache` extension issues.

## Active Decisions
- **Umbraco 17 Migration**: Project is running on .NET 10/Umbraco 17.
- **Strict Accessibility**: Enforcing a11y rules in all new components.
- **MCP Integration**: Utilizing `umbraco-mcp` for streamlined Umbraco operations.
- **Content Modeling**: Adopting a Composition-over-Inheritance approach where `SubPage` aggregates shared interfaces (`ISeo`, `ISharing`, etc.) and functional pages (`Blog`, `Service`) inherit this baseline.

## Next Steps
- Validate all existing artifacts against the new `GEMINI.md` rules.
- Continue implementation of outstanding feature requests (e.g., further Block Styles).
