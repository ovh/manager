# Drawer Component

## Current Implementation

The drawer component comes in two variants, accessible via two separate components: `Drawer` and `DrawerCollapsible`.

Both components use the `DrawerBase` component.

- `DrawerBase` should not be exposed to library consumers.
- `DrawerBase` implements all shared behaviors for the two exported components.

## Where to Add New Features

When adding a feature to the drawer:

- If it is shared by both variants, add it to `DrawerBase`.
- If it is specific to one component, add it to the relevant component.
- If it is specific to one component but cannot be implemented outside of `DrawerBase`, add it to `DrawerBase` but only expose the related props in the relevant component.
- If it diverges too much from the existing variants, consider creating a new one.
