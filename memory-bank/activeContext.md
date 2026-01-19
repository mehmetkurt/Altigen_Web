# Active Context

## Current Status
The project is in active development (January 2026), focusing on:
1.  **Memory Bank Initialization**: Establishing the documentation structure.
2.  **Backoffice Customization**: Developing custom property editors (`AdvancedDropdown`, `UnitSelector`, etc.).
4.  **Main Slider Enhancement**: Adding thumbnail navigation and visual improvements.
5.  **Blog Optimization**: Fixing warnings and refining the blog experience.

## Recent Changes
- Fixed git ignore cache for `Altigen.Web/wwwroot/App_Plugins/codeislife.elements/dist` folder.
- Changed application ports to `56920` (http) and `44320` (https) in `launchSettings.json` to resolve `SocketException` caused by excluded port range.
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
- **Blog List Refactoring**: 
    - **Search Removed:** Blog search functionality has been completely removed.
    - **Filtering:** Switched from Isotope.js (Client-Side) to Server-Side Category Navigation for SEO and Paging compatibility.
    - **Modern UI:** Blog cards updated with a premium design.
    - **Components:** `BlogCategory.cshtml` creates dedicated pages for categories.
    - **Architecture:** `BlogList` and `BlogCategory` share `_BlogGrid` and `_Pager` partials.
    - **Content Hierarchy:** Restructured `BlogList` -> `BlogCategory` -> `Blog`.
    - **Strongly-Typed Views:** Introduced `BlogItemViewModel` for partial views.
    - **Partial Views:** Extracted rendering logic to `_BlogGrid.cshtml` and `_BlogCard.cshtml` partials.
- **Global Paging Implementation**:
    - **Structure:** `PagingConfigModel`, `PagingExtensions` (inheritance logic), `PagerViewModel`.
    - **UI:** `_Pager.cshtml` partial view using Bootstrap pagination.
    - **Integration:** Applied to `BlogList.cshtml` with server-side paging logic via `GetEffectivePagingConfig()`.
- **Blog Compilation Fixes**:
    - Replaced obsolete `Parent` property usage with `Parent<IPublishedContent>()` in `Blog.cshtml` and `_BlogNavigation.cshtml`.
    - Added null safety checks for `Url()` and `Name` properties.
- **Main Slider Enhancement**:
    - **Thumbnails**: Added thumbnail navigation using `SliderItem.thumbnail` property.
    - **Pagination**: Removed bullet pagination in favor of thumbnails and arrows.
    - **Overlay**: Added a dark overlay (`.slider-overlay`) to slides to improve text readability on all backgrounds.
    - **Alignment**: Fixed thumbnail container alignment using `width: fit-content` and `slidesPerView: 'auto'`.
    - **Cleanup**: Removed all HTML/Razor comments and invisible thumbnail text (`.thumb-text`) from `Default.cshtml` for cleaner UI/code.
    - **Logic Fix**: Updated thumbnail logic to prioritize `thumbnail` property and enforce 150x100 crop for consistency, falling back to cropped `image` if thumbnail is missing.
- **Page Header Enhancement**:
    - **Background Image**: Implemented support for `PageHeaderBackgroundImage`.
    - **Overlay**: Added a semi-transparent black overlay using CSS `linear-gradient` to ensure text readability against any background.
    - **Styling**: Enforced `background-size: cover`, `background-position: center`, and `no-repeat` for optimal display.
- **RichText Block Styling investigation**:
    - Identified that `BlockStyleService` currently ignores RichText properties. (Paused to address immediate UI requests).

## Active Decisions
- **Umbraco 17 Migration**: Project is running on .NET 10/Umbraco 17.
- **Strict Accessibility**: Enforcing a11y rules in all new components.
- **MCP Integration**: Utilizing `umbraco-mcp` for streamlined Umbraco operations.
- **Content Modeling**: Adopting a Composition-over-Inheritance approach where `SubPage` aggregates shared interfaces (`ISeo`, `ISharing`, etc.) and functional pages (`Blog`, `Service`) inherit this baseline.

## Next Steps
- Validate all existing artifacts against the new `GEMINI.md` rules.
- Continue implementation of outstanding feature requests (e.g., further Block Styles).
