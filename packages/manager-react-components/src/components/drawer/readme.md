# Drawer Component

## How to use the Drawer Component

The Drawer component is designed in a composable way.
The most common way to declare a drawer will be :

```tsx
<Drawer.Root isOpen={isOpen} onDismiss={handleDismiss} isLoading={isLoading}>
  <Drawer.Header title="This is the drawer title" />
  <Drawer.Content>
    <div>The is the custom content of the drawer</div>
  </Drawer.Content>
  <Drawer.Footer
    primaryButtonLabel="Submit"
    isPrimaryButtonDisabled={isDisabled}
    isPrimaryButtonLoading={isSubmiting}
    onPrimaryButtonClick={handleSubmit}
    secondaryButtonLabel="Close"
    onSecondaryButtonClick={handleDismiss}
  />
</Drawer.Root>
```

⚠ Please put you content in a `Drawer.Content` component to ensure good positioning.

## `DrawerRoot` and `DrawerRootCollapsible`

The drawer component comes in two variants, accessible via two separate components: `DrawerRoot` and `DrawerRootCollapsible`.

Both components use the `DrawerBase` component.

- `DrawerBase` should not be exposed to library consumers.
- `DrawerBase` implements all shared behaviors for the two exported components.

### Where to Add New Features

When adding a feature to the drawer that must be in the root component (DrawerRoot or DrawerRootComposable):

- If it is shared by both variants, add it to `DrawerBase`.
- If it is specific to one component, add it to the relevant component.
- If it is specific to one component but cannot be implemented outside of `DrawerBase`, add it to `DrawerBase` but only expose the related props in the relevant component.
- If it diverges too much from the existing variants, consider creating a new one.
