# Active Context

## Current Status
The project is in active development (January 2026), focusing on:
1.  **Memory Bank Initialization**: Establishing the documentation structure.
2.  **Backoffice Customization**: Developing custom property editors (`AdvancedDropdown`, `UnitSelector`, etc.).
3.  **Main Slider Enhancement**: Adding thumbnail navigation and visual improvements.
4.  **Blog Optimization**: Fixing warnings and refining the blog experience.

## Recent Changes
- Enforced `UmbracoUrlAlias` check for all `ISeo` implementations to support custom URL overrides.
- Updated `GEMINI.md` and Memory Bank to reflect the new SEO URL handling rule.
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
- Moved `TableOfContentsParser` to `Altigen.Web.Core.Parser` and updated `_ViewImports` to clean up namespace usage in Views.
- Standardized View inheritance by removing explicit `@inherits` directives and redundant `@using` statements in favor of `_ViewImports.cshtml`.
- Refactored `_BlogGallery.cshtml` partial to delegate asset loading (CSS/JS) to `Blog.cshtml` via standard `Head` and `Scripts` sections, adhering to layout structure.
- Refactored `_Scripts.cshtml` inline navigation logic to `navigation.js`.
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
  ## Current Focus
- Refactoring Footer component (Separated Social Links into Partial).

## Recent Changes
- Extracted Social Links logic from `Footer/Default.cshtml` to `_SocialLinks.cshtml` partial.
- Implemented dynamic Social Media icons in Footer.
- Refined Footer layout (3-6-3 grid, horizontal gap).
- Updated `FooterViewComponent` to map these values from `GlobalSettings`.
- Updated `Footer/Default.cshtml` to render dynamic content instead of hardcoded strings.
- Resolved `CS8618` warning in `FooterViewModel.cs` by adding `required` modifier to `Logo` and `Description` properties, enforcing initialization at compile time.
- Implemented `FooterMenu/Default.cshtml` and `FooterMenuViewComponent.cs` to utilize the standard `Navigation` model.
- Added logic to `FooterMenu` to dynamically generate columns based on `isColumnHeader` property, limiting recursion to the first level of sub-items.
- Updated `TopMenuViewComponent` and `FooterMenuViewComponent` to filter `Navigation` nodes by `NavigationType` ("Header" vs. "Footer"), ensuring correct menu resolution.
- Resolved `CS8601` and `CS8619` warnings in `FooterViewComponent.cs` by ensuring `Description` is not null and correctly casting `SocialIcons` using `OfType<SocialItem>()`.
- **Region Module Update**: Introduction of `RegionList` and `RegionCategory` which now inherit from `PagingList`, standardizing the pagination logic and hierarchy (`RegionList` -> `RegionCategory` -> `Region`).
- **Region List UI**: Implemented `RegionList.cshtml`, `_RegionGrid.cshtml`, `_RegionCard.cshtml`, and `region.scss` to display Region Categories in a grid layout with card style and pagination.
- **Location Filter**: Implemented filtering logic in `RegionList.cshtml` to filter categories based on their children's locations (City/District). Added a filter toolbar similar to Blog List.
- **Hierarchical & Coverage Filtering**: Refined filtering logic to support hierarchical coverage. If a parent (e.g., City) is selected in the Region, it covers all child filters (District/Neighborhood). Conversely, filtering by a parent (District) shows regions assigned to its children (Neighborhood).
- **UI Refinement**: Updated `region.scss` to style filter dropdowns with a modern "pill-shaped" look, matching the Blog Category buttons.
- **Footer Layout**: Fixed horizontal overflow on mobile by using responsive gutter classes (`gx-0 gx-lg-5`) in `Default.cshtml`.
- **Region Service Extraction**:
    - Created `IRegionService` and `RegionService` in `Altigen.Web.Core` to encapsulate location data retrieval and filtering logic.
    - Registered `RegionService` in `ServiceComposer`.
    - Refactored `RegionList.cshtml` to use `RegionService`, removing complex inline logic.
    - Implemented `GetRelatedServicesInLocation` to display "Related Services" on `Region.cshtml` sidebar.
- **Clean Code & Modern Practices**:
    - Replaced obsolete `IPublishedContent.Parent` property access with `.Parent()` extension method in `RegionService.cs`.
    - Fixed `CS8604` warnings by adding null checks for `content` in recursive methods.
    - Resolved widespread nullability warnings (`CS8600`, `CS8602`, `CS8604`) in `RegionList.cshtml` and `RegionService.cs`.
    - Adopted C# 12 collection expressions (`[]`) in `RegionService.cs` to simplify initialization.
    - Removed unused `CheckLocationMatch` legacy helper and deprecated the string-based `FilterCategoriesByLocation` overload.
    - Configured `RequestHandler` in `appsettings.json` to replace Turkish characters (e.g., 'ş' -> 's') and strip special characters (e.g., '?', '!') from URLs.
    - **Region Detail UI**: Refactored "Service Regions" list in `Region.cshtml` to use a Bootstrap List Group with icons and descriptions. Added custom hover effects (#eee background, rounded corners) via `region-detail.scss`.
    - **SCSS Refactoring**: Split `region.scss` into `region-list.scss`, `region-detail.scss`, and `region-common.scss` for better modularity and scoping. Updated `compilerconfig.json` accordingly.
    - Updated `GEMINI.md` to enforce modern C# features and SCSS-only styling.
- **Region Detail UI Update**: Aligned "Bölgedeki Diğer Hizmetler" (Related Services) visual style with the "Hizmet Bölgeleri" list. Both sections now use consistent card headers, circular icons, and list-group styling. Removed non-navigational links from "Hizmet Bölgeleri". 
- **Related Services Display Fix**: Updated "Related Services" list in `Region.cshtml` to display the Parent Name (Service Category, e.g., "Halı Yıkama") instead of the Item Name (Location, e.g., "Beylikdüzü") to correctly represent distinct services in the same region.
- **Sorting Fix**: Removed custom sorting (`OrderByDescending`, `Guid.NewGuid`) from `RegionList.cshtml`, `RegionCategory.cshtml`, and `RegionService.cs`. The application now fully respects the Sort Order defined in Umbraco Backoffice.
- **Cleanup**: Removed redundant `@using` statements from `RegionCategory.cshtml`, relying on `_ViewImports.cshtml`.

## Active Decisions
- **Umbraco 17 Migration**: Project is running on .NET 10/Umbraco 17.
- **Strict Accessibility**: Enforcing a11y rules in all new components.
- **MCP Integration**: Utilizing `umbraco-mcp` for streamlined Umbraco operations.
- **Content Modeling**: Adopting a Composition-over-Inheritance approach where `SubPage` aggregates shared interfaces (`ISeo`, `ISharing`, etc.) and functional pages (`Blog`, `Service`) inherit this baseline.
- **Code Cleanliness**: Strict enforcement of no unnecessary blank lines, no inline scripts, and using `_ViewImports` for namespaces.

## Next Steps
- Validate all existing artifacts against the new `GEMINI.md` rules.
- Continue implementation of outstanding feature requests (e.g., further Block Styles).
