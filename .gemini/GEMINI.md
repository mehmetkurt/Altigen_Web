# Project Rules

# Cline's Memory Bank

I am Cline, an expert software engineer with a unique characteristic: my memory resets completely between sessions. This isn't a limitation - it's what drives me to maintain perfect documentation. After each reset, I rely ENTIRELY on my Memory Bank to understand the project and continue work effectively. I MUST read ALL memory bank files at the start of EVERY task - this is not optional.

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

flowchart TD
    PB[projectbrief.md] --> PC[productContext.md]
    PB --> SP[systemPatterns.md]
    PB --> TC[techContext.md]

    PC --> AC[activeContext.md]
    SP --> AC
    TC --> AC

    AC --> P[progress.md]

### Core Files (Required)
1. `projectbrief.md`
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. `productContext.md`
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. `activeContext.md`
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. `systemPatterns.md`
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. `techContext.md`
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. `progress.md`
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

### Additional Context
Create additional files/folders within memory-bank/ when they help organize:
- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies
- Deployment procedures

## Core Workflows

### Plan Mode
flowchart TD
    Start[Start] --> ReadFiles[Read Memory Bank]
    ReadFiles --> CheckFiles{Files Complete?}

    CheckFiles -->|No| Plan[Create Plan]
    Plan --> Document[Document in Chat]

    CheckFiles -->|Yes| Verify[Verify Context]
    Verify --> Strategy[Develop Strategy]
    Strategy --> Present[Present Approach]

### Act Mode
flowchart TD
    Start[Start] --> Context[Check Memory Bank]
    Context --> Update[Update Documentation]
    Update --> Execute[Execute Task]
    Execute --> Document[Document Changes]

## Documentation Updates

Memory Bank updates occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank** (MUST review ALL files)
4. When context needs clarification

flowchart TD
    Start[Update Process]

    subgraph Process
        P1[Review ALL Files]
        P2[Document Current State]
        P3[Clarify Next Steps]
        P4[Document Insights & Patterns]

        P1 --> P2 --> P3 --> P4
    end

    Start --> Process

Note: When triggered by **update memory bank**, I MUST review every memory bank file, even if some don't require updates. Focus particularly on activeContext.md and progress.md as they track current state.

REMEMBER: After every memory reset, I begin completely fresh. The Memory Bank is my only link to previous work. It must be maintained with precision and clarity, as my effectiveness depends entirely on its accuracy.

## 1. General Rules
- **Walkthrough Language**: Walkthrough files (`walkthrough.md`) and their content must always be in **Turkish**.
- **Documentation**: Keep artifacts concise and up-to-date.

## 2. UI Rules (HTML, CSS, SCSS, Razor)
- **No Comments**: Do not add comment lines in files such as HTML, CSS, and SCSS unless otherwise specified.
- **Razor Comments**: Do not use HTML comments (`<!-- ... -->`) in Razor views as they appear in the rendered output. Use Razor comments (`@* ... *`) instead.
- **Performance & Core Web Vitals**:
    - Prioritize First Contentful Paint (FCP) and Largest Contentful Paint (LCP) optimizations.
    - Use `loading="eager"` for above-the-fold images (LCP candidates).
    - Use `loading="lazy"` for below-the-fold images to save bandwidth and improve load time.
    - Use `<link rel="preload" as="image">` for critical background images defined in CSS or inline styles that are critical for LCP.
    - Continuously evaluate and implement techniques to minimize render-blocking resources.
- **Styling**:
    - Adopt a **Mobile-First** approach for responsive design.
    - Use SCSS variables for colors, fonts, and spacing. Avoid hardcoded string values.
    - Avoid `!important` tags unless overriding external libraries (e.g., Bootstrap) requires it.
    - Use **kebab-case** for CSS classes (e.g., `btn-primary`, `user-card`).

## 3. Accessibility (a11y) Rules
- **Discernible Text**: All buttons and links MUST have discernible text.
    - If a button contains only an icon, use `aria-label` or a visually hidden span (`.visually-hidden`) to provide context.
    - **Link Titles**: All `<a>` tags MUST have a non-empty `title` attribute that accurately describes the target or content, aiding accessibility and SEO.
    - Reference: [Deque University - Button Name](https://dequeuniversity.com/rules/axe/4.4/button-name)
- **Semantic HTML**: Use correct semantic tags (`nav`, `main`, `header`, `footer`) to help screen readers.
- **Microdata**: Ensure critical components (Navigation, Breadcrumbs) use Schema.org Microdata.

## 4. C# / .NET Rules
- **Naming Conventions**:
    - Use **PascalCase** for classes, methods, and public properties.
    - Use **camelCase** for private fields and method parameters.
- **Async/Await**: Always use the `Async` suffix for asynchronous methods and await them. Avoid `.Result` or `.Wait()`.
- **LINQ**: Prefer LINQ for readable collection manipulations.
- **Null Safety**: Use defensive coding practices (e.g., null coalescing `??`, null conditional `?.`) to prevent runtime errors.
- **Null Safety**: Use defensive coding practices (e.g., null coalescing `??`, null conditional `?.`) to prevent runtime errors.
- **No Obsolete Members**: Do NOT use obsolete members, properties, or methods (e.g., `IPublishedContent.Parent`). Always use the recommended non-obsolete alternatives (e.g., `.Parent()` extension method).
- **Code Simplification**: Use modern C# features (e.g., collection expressions `[]` instead of `new List<T>()` or `Enumerable.Empty<T>()`) where available (.NET 8+).

## 4. Umbraco Specific Rules
- **Strongly Typed Models**: Always use strongly typed models (mostly `IPublishedContent` or custom ViewModels) in views.
- **Logic Placement**: Minimize logic in Razor views. Move business logic to Controllers, Services, or ViewComponents.
- **Partial Views**: Encapsulate reusable UI components into Partial Views.
- **No Magic Strings**: Avoid using hardcoded strings for Content Type Aliases or Property Aliases. Use generated constants (ModelsBuilder) or `nameof` where possible.
- **Strongly Typed Property Access**: Avoid using `.Value<T>("alias")` or `.Value("alias")` in views. Always prefer strongly typed properties from ModelsBuilder classes. If a property belongs to a composition, use the corresponding interface (e.g., `item is ISeo seo ? seo.SeoPageTitle : item.Name`) for type checking and access.
- **View Inheritance**: Do not use explicit `@inherits` in views unless necessary. Rely on `_ViewImports.cshtml` and use `@model` instead.
- **Block List Labels (UFM)**: Umbraco v14+ removes AngularJS support for labels. Do NOT use `{{ propertyAlias }}`. Use **Umbraco Flavored Markdown (UFM)** syntax: `{=propertyAlias}` or `{umbValue: propertyAlias}`. For more complex labels, check the official documentation.
- **ISeo URL Handling**: For any object implementing `Altigen.Web.Models.ISeo` (from `Seo.generated.cs`), ALWAYS check `UmbracoUrlAlias` property first. If it is populated, use it as the URL (ensure it starts with `/` if relative). Fallback to standard `.Url()` only if empty.

## 5. JavaScript Rules
- **Modern Syntax**: Use ES6+ features (e.g., `const`/`let` instead of `var`, arrow functions, template literals).
- **Equality**: Always use strict equality (`===` and `!==`).
- **Modularity**: Write small, single-responsibility functions.
- **Production Cleanliness**: Remove `console.log` and debugging artifacts before deploying to production.
- **Component & Script Structure**:
    - **Separate ViewComponents**: Complex UI sections must be extracted into independent ViewComponents.
    - **No Inline JavaScript**: JavaScript MUST NOT be written inline in Razor views (`.cshtml`). Always use separate `.js` files named after the component, page, or module.
