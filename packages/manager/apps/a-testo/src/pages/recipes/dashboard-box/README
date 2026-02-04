# Dashboard Box

## Short description

The Dashboard Box is a card-based recipe that displays structured key-value information in a semantic definition list format. It provides a consistent way to present service details, metrics, and configuration values in dashboard pages, with support for labels, tooltips, actions, and various content types.

## Usage

Use this recipe when you need to display structured information in a dashboard or overview page. This recipe is suitable for:

- Service overview pages showing key metrics and status
- Configuration panels displaying settings and values
- Detail views presenting structured data in a scannable format
- Any context where you need to show labeled information pairs in a card container

This recipe helps users quickly scan and understand key information about a service or resource through its clear term-description structure.

## Variants

The Dashboard Box supports different card colors through the `color` prop on the Root component. The default color is `CARD_COLOR.neutral`, but you can use any valid `CARD_COLOR` value to match your design context.

## Do's & Don'ts

### Do

- Use semantic HTML structure: always pair `Term` with `Description` within an `Item.Root`
- Provide clear, concise labels for terms
- Use tooltips to explain complex terms or provide additional context
- Include actions (like edit buttons or menus) in the `Term` component when users need to interact with the information
- Use the `divider` prop on `Description` to control spacing between items
- Support various content types in descriptions: text, badges, links, clipboards, skeletons, and custom components

### Don't

- Don't use Dashboard Box for long-form content or paragraphs that don't fit a key-value structure
- Don't nest Dashboard Box components inside each other
- Don't use it for interactive forms or complex input fields
- Don't omit the `title` prop on the Root component
- Don't use multiple `Description` components without proper spacing or dividers

## Behavior and content rules

- The Root component requires a `title` prop that displays as a heading above the content
- Each item must contain at least one `Term` and one `Description` component
- The `Description` component automatically includes a divider by default (`divider={true}`), which can be disabled for the last item or when multiple descriptions are used
- The recipe uses semantic HTML (`<dl>`, `<dt>`, `<dd>`) for accessibility and proper document structure
- Terms support optional tooltips and action elements (like buttons or menus) displayed on the right side
- Descriptions can include an optional label before the main content

## Relationships to other recipes or components

- The Dashboard Box uses the `Card` component from `@ovhcloud/ods-react` as its base container
- It's commonly used within dashboard page layouts alongside other dashboard components
- For simpler key-value displays without a card container, consider using the definition list components directly
- For more complex interactive forms or data entry, use dedicated form recipes instead
