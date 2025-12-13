# Project Rules

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

## 4. Umbraco Specific Rules
- **Strongly Typed Models**: Always use strongly typed models (mostly `IPublishedContent` or custom ViewModels) in views.
- **Logic Placement**: Minimize logic in Razor views. Move business logic to Controllers, Services, or ViewComponents.
- **Partial Views**: Encapsulate reusable UI components into Partial Views.
- **No Magic Strings**: Avoid using hardcoded strings for Content Type Aliases or Property Aliases. Use generated constants (ModelsBuilder) or `nameof` where possible.
- **View Inheritance**: Do not use explicit `@inherits` in views unless necessary. Rely on `_ViewImports.cshtml` and use `@model` instead.
- **Block List Labels (UFM)**: Umbraco v14+ removes AngularJS support for labels. Do NOT use `{{ propertyAlias }}`. Use **Umbraco Flavored Markdown (UFM)** syntax: `{=propertyAlias}` or `{umbValue: propertyAlias}`. For more complex labels, check the official documentation.

## 5. JavaScript Rules
- **Modern Syntax**: Use ES6+ features (e.g., `const`/`let` instead of `var`, arrow functions, template literals).
- **Equality**: Always use strict equality (`===` and `!==`).
- **Modularity**: Write small, single-responsibility functions.
- **Production Cleanliness**: Remove `console.log` and debugging artifacts before deploying to production.
- **Component & Script Structure**:
    - **Separate ViewComponents**: Complex UI sections must be extracted into independent ViewComponents.
    - **No Inline JavaScript**: JavaScript MUST NOT be written inline in Razor views (`.cshtml`). Always use separate `.js` files named after the component, page, or module.
