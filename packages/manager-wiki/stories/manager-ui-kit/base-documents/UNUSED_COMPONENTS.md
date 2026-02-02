# Unused Components Report

## Summary
This report identifies components in the `base-documents` folder that are not being imported or used anywhere in the codebase.

**Status:** ✅ **ALL UNUSED COMPONENTS HAVE BEEN DELETED**

## Unused Components

### 1. **Homepage** 
- **Location:** `components/homepage/Homepage.tsx`
- **Status:** ❌ UNUSED
- **Description:** Homepage component for OVHcloud Design System introduction
- **Note:** Component exists but is never imported or used in any stories or MDX files

### 2. **Gallery**
- **Location:** `components/gallery/Gallery.tsx`
- **Status:** ❌ UNUSED
- **Description:** Gallery component for displaying component previews
- **Note:** Component exists but is never imported or used

### 3. **DesignTokens**
- **Location:** `components/designTokens/DesignTokens.tsx`
- **Status:** ❌ UNUSED
- **Description:** Component for displaying design tokens documentation
- **Note:** Component exists but is never imported or used. However, it uses internal components:
  - `TokenPreview` (used internally)
  - `TokensTable` (used internally)

### 4. **NoToC**
- **Location:** `components/noToC/NoToC.tsx`
- **Status:** ❌ UNUSED
- **Description:** Component that hides the table of contents in Storybook docs
- **Note:** Component exists but is never imported or used

### 5. **OdsLocaleList**
- **Location:** `components/odsLocaleList/OdsLocaleList.tsx`
- **Status:** ❌ UNUSED
- **Description:** Component that displays a list of ODS locales
- **Note:** Component exists but is never imported or used

### 6. **TokenMigrationTable**
- **Location:** `components/tokenMigrationTable/TokenMigrationTable.tsx`
- **Status:** ❌ UNUSED
- **Description:** Component for displaying token migration information
- **Note:** Component exists but is never imported or used

### 7. **Sandbox**
- **Location:** `components/sandbox/Sandbox.tsx`
- **Status:** ❌ UNUSED (main component)
- **Description:** Main sandbox component for code editing
- **Note:** The main Sandbox component is not used, but it's referenced in `constants/meta.ts` for the sandbox tool title. The internal action components are used:
  - `OrientationSwitch` (used internally)
  - `ResetSandbox` (used internally)
  - `ShareLink` (used internally)

## Used Components (for reference)

The following components **ARE** being used:

- ✅ **Banner** - Used in documentation.mdx files
- ✅ **BestPractices** - Used in documentation.mdx files
- ✅ **Canvas** - Used as `OdsCanvas` in technical-information.mdx files
- ✅ **ExternalLink** - Used in Homepage.tsx and documentation.mdx files
- ✅ **Heading** - Used in documentation.mdx files and internally by DesignTokens
- ✅ **IdentityCard** - Used in documentation.mdx files
- ✅ **StorybookLink** - Used in Homepage.tsx and Gallery.tsx
- ✅ **TechnicalSpecification** - Used in technical-information.mdx files
  - ✅ **ClassModule** - Used internally by TechnicalSpecification
  - ✅ **EnumList** - Used internally by TechnicalSpecification

## Actions Taken

✅ **DELETED** - All unused components have been removed:
- `components/homepage/` - ✅ Deleted
- `components/gallery/` - ✅ Deleted
- `components/designTokens/` - ✅ Deleted (including TokenPreview and TokensTable)
- `components/noToC/` - ✅ Deleted
- `components/odsLocaleList/` - ✅ Deleted
- `components/tokenMigrationTable/` - ✅ Deleted
- `components/sandbox/` - ✅ Deleted (including all action components)

✅ **CLEANED UP** - Related code has been cleaned:
- Removed `HOME_TITLE.designTokens` and `HOME_TITLE.sandboxTool` from `constants/meta.ts`
- Removed sandbox functionality from `components/canvas/Canvas.tsx` (simplified to use StorybookCanvas directly)

