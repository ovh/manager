# File and Folder Reorganization Instructions

## Objective

Reorganize the `/src/pages` directory to align with the routing configuration in `/src/routes/routes.tsx` and enforce consistent naming conventions in all the `/src` files.

## Prerequisites

**IMPORTANT:** Before starting any reorganization work, you must:

1. Read and analyze the complete `/src/routes/routes.tsx` file to understand the current route structure
2. Extract the route hierarchy from the lazy imports in the routes configuration
3. Map each route path to its corresponding component file
4. Use this information to guide all folder structure and file naming decisions

The routes file is the single source of truth for how the application should be organized.

## Exceptions

The following files are **exempt** from the naming convention and reorganization rules:

1. **Root-level files in `src/`:** Files directly in the `src/` directory (not in subdirectories) are exempt from naming conventions.
   - Examples: `App.tsx`, `main.tsx`, `index.css`, `vite-env.d.ts`, `query.client.ts`, `i18n.ts`
   - These files should remain at the root level and keep their original names

2. **Files starting with underscore (`_`):** Any **file** (not folder) starting with `_` is exempt from the naming conventions.
   - Examples: `_helpers.ts`, `_utils.ts`, `_constants.ts`
   - Note: Folders like `_components/`, `_helpers/`, `_utils/` are NOT exempt - only the files themselves
   - Files inside `_components/` folders must still follow the naming conventions

**Important:** When moving or renaming files, skip these exempt files entirely. Do not attempt to validate or modify their naming.

## Naming Convention Rules

### 1. File Naming Conventions

**Test Files (.spec.tsx):**

- Format: match the tested file name and append `.spec.tsx`
  - Examples:
    - `ListOrganizations.page.tsx` → `ListOrganizations.page.spec.tsx`
    - `Organization.layout.tsx` → `Organization.layout.spec.tsx`
    - `BanUser.modal.tsx` → `BanUser.modal.spec.tsx`
    - `OrganizationHeader.component.tsx` → `OrganizationHeader.component.spec.tsx`
    - `useDownload.hook.tsx` → `useDownload.hook.spec.tsx`
- **Location:** keep each `.spec.tsx` file in the same folder as the file it tests
- **Uniqueness:** test file names must be globally unique if the tested file names are globally unique

**Page Files:**

- Format: `[Action][Entity].page.tsx` where Action is preferably one of: `List`, `Create`, `Update`, or `Delete`
- If not one of those actions, use a descriptive name that includes context: `[Context][RouteName].page.tsx`
- **Uniqueness:** File names should be globally unique across the project. If multiple files have the same name, add context/hierarchy information to differentiate them.
- Examples:
  - `ListOrganizations.page.tsx` (list all organizations at root level)
  - `ListOrganizationUsers.page.tsx` (list users within an organization - adds context)
  - `UpdateOrganizationDashboard.page.tsx` (update organization from dashboard context)
  - `OrganizationDashboard.page.tsx` (dashboard scoped to organization)
  - `ProjectDashboard.page.tsx` (dashboard scoped to project)
- **React Component Rule:** The default export component must be named exactly the same as the file name (without extension)
  - File: `ListOrganizations.page.tsx` → Component: `export default function ListOrganizations() { ... }`
  - File: `ListOrganizationUsers.page.tsx` → Component: `export default function ListOrganizationUsers() { ... }`

**Layout Files:**

- Format: `[EntityName].layout.tsx` or `[Context][EntityName].layout.tsx` for uniqueness
- **Uniqueness:** File names should be globally unique across the project. If multiple layouts exist for the same entity, add context/hierarchy information.
- Examples: `Root.layout.tsx`, `Organization.layout.tsx`, `OrganizationDashboard.layout.tsx`, `ProjectDashboard.layout.tsx`
- **React Component Rule:** The default export component must be named exactly the same as the file name (without extension)
  - File: `Organization.layout.tsx` → Component: `export default function Organization() { ... }`
  - File: `OrganizationDashboard.layout.tsx` → Component: `export default function OrganizationDashboard() { ... }`

**Modal Files:**

- Format: `[ActionEntity].modal.tsx`
- Examples: `BanUser.modal.tsx`, `FlushPackage.modal.tsx`, `DeletePackage.modal.tsx`
- **React Component Rule:** The default export component must be named exactly the same as the file name (without extension)
  - File: `BanUser.modal.tsx` → Component: `export default function BanUser() { ... }`

**Component Files (in \_components folders):**

- Component files: `[ComponentName].component.tsx`
- Hook files: `[hookName].hook.tsx` (camelCase for hook name)
- Constants: `[name].constants.ts`
- Context files: `[ContextName].context.tsx`
- Examples:
  - `OrganizationHeader.component.tsx`
  - `UsersListTable.component.tsx`
  - `useEditGeneralInfoForm.hook.tsx`
  - `colors.constants.ts`
- **React Component Rule:** The default export component must be named exactly the same as the file name (without extension)
  - File: `OrganizationHeader.component.tsx` → Component: `export default function OrganizationHeader() { ... }`

## Naming Conventions for Other Directories

### Files in `src/components/`

**Component Files:**

- Format: `[ComponentName].component.tsx`
- **Uniqueness:** Component names should be descriptive and globally unique where possible. Include domain/feature context if the component is domain-specific.
- Examples: `DataTable.component.tsx`, `MonithorBreadcrumb.component.tsx`, `JsonEditor.component.tsx`, `OrganizationFilter.component.tsx`, `ProjectSelector.component.tsx`
- **React Component Rule:** The default export component must be named exactly the same as the file name (without extension)

**Hook Files:**

- Format: `use[HookName].hook.tsx`
- Examples: `useHorizontalScroll.hook.tsx`, `useColumnFilters.hook.tsx`
- **React Component Rule:** The default export hook must be named exactly the same as the file name (without extension)

**Directory Organization:**

- Group related components in subdirectories: `src/components/[feature-name]/`
- Each feature directory contains the component file and optional `_helpers/` subdirectory for utility functions

### Files in `src/context/`

**Context Files:**

- Format: `[ContextName].context.tsx`
- Examples: `DisplayMode.context.tsx`, `OrganizationFilter.context.tsx`
- **React Component/Hook Rule:** Named exports should follow: `[ContextName]Context` for the context object and `use[ContextName]Context` for the hook
  - File: `DisplayMode.context.tsx`
  - Exports: `export const DisplayModeContext = ...` and `export const useDisplayModeContext = ...`

**Organization:**

- One context per file
- Related contexts can be grouped in subdirectories if needed

### Files in `src/hooks/`

**Hook Files:**

- Format: `use[HookName].hook.tsx`
- Examples: `useAuthUser.hook.tsx`, `useOrganizationQuery.hook.tsx`, `useFormValidation.hook.tsx`
- **Naming Rule:** The hook function must be named exactly the same as the file name (without extension)
  - File: `useAuthUser.hook.tsx` → Export: `export function useAuthUser() { ... }`

**Organization:**

- One primary hook per file (additional related helpers can be in same file)
- Group related hooks in subdirectories by domain: `src/hooks/auth/`, `src/hooks/queries/`, etc.

### Files in `src/data/api/`

**API Endpoint Files:**

- Format: `[entity].api.ts`
- Examples: `organization.api.ts`, `project.api.ts`, `user.api.ts`
- **Naming Rule:** Export named functions for each API endpoint/operation
  - File: `organization.api.ts` → Exports: `export const getOrganizations = ...`, `export const getOrganization = ...`, `export const createOrganization = ...`
- Group related endpoints in the same file by entity/domain

**Organization:**

- One entity/domain per file
- Organize in subdirectories if there are many files: `src/data/api/[domain]/`

### Files in `src/data/hooks/`

**Data Query Hook Files:**

- Format: `use[Action][Entity].hook.ts` where Action is one of: `Get`, `Create`, `Update`, or `Delete`
- Examples: `useGetOrganizations.hook.ts`, `useCreateProject.hook.ts`, `useUpdateUser.hook.ts`, `useDeleteCertificate.hook.ts`
- **Naming Rule:** The hook function must be named exactly the same as the file name (without extension)
  - File: `useGetOrganizations.hook.ts` → Export: `export function useGetOrganizations() { ... }`
  - File: `useCreateProject.hook.ts` → Export: `export function useCreateProject() { ... }`

**Organization:**

- One primary hook per file (additional related helpers can be in same file)
- Group related hooks in subdirectories by entity/domain: `src/data/hooks/organizations/`, `src/data/hooks/projects/`, etc.

### 2. Folder Structure Rules

**Dynamic Route Parameters:**

- Use square brackets for dynamic segments: `[organizationId]`, `[projectId]`, `[packageId]`
- Never use colons (`:`) in folder names

**Nested Routes:**

- Mirror the route structure exactly in the folder hierarchy
- Each route segment gets its own folder
- Exception: Simple routes without children can remain as single files

### 3. React Component Declaration and Export Convention

**Component Declaration:**

- Use arrow function syntax for all React components: `const ComponentName = () => { ... }`
- Do not use function declarations: `function ComponentName() { ... }` ❌
- Do not use named function expressions: `const ComponentName = function() { ... }` ❌

**Component Export:**

- Export components at the end of the file, after all logic and utilities
- Prefer default exports: `export default ComponentName`
- Use default exports for page, layout, and modal components
- Use named exports for utility/helper components only when exporting multiple items from the same file

**Examples:**

```tsx
// Correct: Arrow function, exported at end with default export
const ListOrganizations = () => {
  // component logic here
  return <div>...</div>;
};

export default ListOrganizations;
```

```tsx
// Incorrect: Function declaration
function ListOrganizations() {
  return <div>...</div>;
}

export default ListOrganizations;
```

```tsx
// Correct for helper components: Arrow function, named export
const OrganizationRow = ({ org }) => {
  return <tr>...</tr>;
};

export { OrganizationRow };
```

### 4. Folder Structure Rules

**Dynamic Route Parameters:**

- Use square brackets for dynamic segments: `[organizationId]`, `[projectId]`, `[packageId]`
- Never use colons (`:`) in folder names

**Nested Routes:**

- Mirror the route structure exactly in the folder hierarchy
- Each route segment gets its own folder
- Exception: Simple routes without children can remain as single files

**Component Organization:**

- Private components for a route/page go in `_components/` subfolder
- Components shared across the route's children also go in `_components/`
- Keep `_components` at the appropriate level based on usage scope

**Test Files:**

- Keep `.spec.tsx` files next to the component/layout/page/modal/hook they test
- If a file is moved or renamed, move/rename its `.spec.tsx` test alongside it

**Modal Routes:**

- Modals should be in their own named folder within the parent route
- Example: `/organizations/[organizationId]/users/ban/BanUser.modal.tsx`

### 5. Route-to-File Mapping

Each route should map to a file following this pattern:

```
Route path: /organizations/:organizationId/dashboard/edit
File path: /src/pages/organizations/[organizationId]/dashboard/edit/EditOrganization.page.tsx
```

**Key Rules:**

1. Remove leading `/` from route paths
2. Replace `:paramName` with `[paramName]` in folder names
3. Use descriptive file names, not the URL segment
4. Keep layout files at the route level they serve
5. Page files go in folders named after their route segment

## Specific Reorganization Tasks

### Task 1: Review Current Structure

1. Map all existing files to their routes in `routes.tsx`
2. Validate every file name against the naming conventions in this document (pages, layouts, modals, components, hooks, context)
   - **Skip files at the root of `src/` directory**
   - **Skip files starting with `_` (but not folders - files inside `_components/` must be validated)**
3. Validate every exported React component/hook name matches its file name (without extension)
4. Identify folders that don't match the route structure
5. Create a mapping document: `old_path → new_path`, including the planned new file name and component name

### Task 2: Create Target Folder Structure

Based on your analysis of `routes.tsx` from Task 1, generate the target folder structure:

1. **Parse the route hierarchy** - walk through each route definition in routes.tsx
2. **Convert routes to folder paths:**
   - Route path segments become folder names
   - Dynamic parameters (`:paramName`) become `[paramName]` folders
   - Each lazy import path indicates where a file should be located
3. **Build the folder tree** showing:
   - All necessary directories based on route structure
   - Where each `.page.tsx`, `.layout.tsx`, and `.modal.tsx` file should live
   - Where `_components/` folders should exist (for routes with private components)
   - Any additional files discovered (like `.context.tsx` files)

4. **Generate the target file list** with exact filenames and expected default export names that comply with the naming conventions

Create the necessary directories before moving files to ensure smooth relocation.

### Task 3: Rename and Move Files

For each file that doesn't match conventions:

1. **Enforce file naming conventions:**

- Rename any file that does not follow the exact naming convention for its category
- For page files, prefer the `ActionEntity.page.tsx` pattern when applicable
- Ensure modal/layout/component/hook/context filenames use the correct suffix

2. **Enforce component and hook naming:**

- Rename the default export React component/hook to match the file name exactly (without extension)
- Update any related import/export names accordingly

3. **Check for correct location:**
   - Does its folder path match the route structure?
   - Are dynamic parameters in `[brackets]` not `:colons`?
   - Is it in the right depth of the hierarchy?
   - If not, move it

4. **Update imports:**
   - After moving/renaming, update all import statements in affected files
   - Use grep/search to find all imports of the moved file
   - Update them to use the new path

### Task 4: Handle Special Cases

**Edit Routes:**

- Edit routes like `dashboard/edit` should have their page in an `edit/` subfolder
- Example: `dashboard/edit-organization/EditOrganization.page.tsx` → `dashboard/edit/EditOrganization.page.tsx`

**Modal Routes:**

- Group modals by action type if they share functionality
- Example: All flush-related modals in `store/flush/` folder

**Component Folders:**

- Keep `_components/` folders at the appropriate scope level
- Move components to parent `_components/` if used by multiple child routes
- Keep components in child `_components/` if only used locally

**Context Files:**

- Keep context files (`.context.tsx`) at the same level as the component/layout that provides them
- Example: `Organization.context.tsx` stays with `Organization.layout.tsx`

### Task 5: Enforce Component Declaration and Export Conventions

For all React component files (pages, layouts, modals, components, hooks):

**Important:** Skip files at the root of `src/` and files starting with `_` (folders like `_components/` are not exempt - their contents must be updated)

1. **Convert function declarations to arrow functions:**
   - Find all components using `function ComponentName() { ... }` syntax
   - Rewrite them as `const ComponentName = () => { ... }`
   - Keep all logic and behavior identical; only change the declaration syntax

2. **Move exports to end of file:**
   - Locate the export statement for each component
   - Move it to the very end of the file (after all helper functions, utilities, constants)
   - Example: Component logic → Helper functions → Export statement

3. **Enforce default exports:**
   - Page, layout, and modal components must use default export: `export default ComponentName`
   - Update any re-exports or intermediate exports

4. **Validate the changes:**
   - Ensure the file still functions identically
   - Verify imports still resolve correctly
   - Check that the component renders the same way

**Examples of corrections:**

```tsx
// Before: Function declaration, exported at top
export function ListOrganizations() {
  const [data, setData] = useState([]);
  return <div>...</div>;
}

// After: Arrow function, exported at end
const ListOrganizations = () => {
  const [data, setData] = useState([]);
  return <div>...</div>;
};

export default ListOrganizations;
```

### Task 6: Verify Imports and Build

After all moves:

1. Update all import paths in `routes.tsx` to match the new structure
2. Search for and update any remaining references to old paths in the entire codebase using automated search (grep or equivalent)
3. Ensure all imports in all files resolve correctly (no unresolved import errors)
4. Run `yarn build` and ensure it completes successfully without any errors. The build must not fail.
5. If the build fails, fix all import or path issues until `yarn build` passes cleanly.
6. Validate route loading programmatically if applicable (e.g., automated smoke checks); do not rely on manual UI testing.
7. Run `yarn lint --fix` to fix coding style at the end (warnings are ok)

## Execution Checklist

- [ ] Document current file structure
- [ ] Create path mapping (old → new)
- [ ] Create target folder structure
- [ ] Rename files to match conventions
- [ ] Move files to correct locations
- [ ] Update imports in moved files
- [ ] Update imports in files that import moved files
- [ ] Update routes.tsx import paths
- [ ] Move/rename .spec.tsx files with their targets
- [ ] Remove empty directories
- [ ] Verify application builds successfully
- [ ] Validate critical routes via automated checks

## Additional Rules

1. **Never break imports:** Always update imports after moving files
2. **Preserve git history:** Use `git mv` instead of `mv` when possible
3. **One step at a time:** Move one logical group at a time and run automated checks
4. **Maintain consistency:** If a pattern exists in one section, replicate it elsewhere
5. **Document exceptions:** If a file can't follow the pattern, record the reason in the change log
6. **Respect exemptions:** Never rename or apply naming conventions to:
   - Files at the root of `src/` directory
   - Files (not folders) starting with `_`

## Commands for Execution

### Find files to rename

```bash
# Find files not following naming conventions
find src/pages -type f -name "*.tsx" ! -name "*.page.tsx" ! -name "*.layout.tsx" ! -name "*.modal.tsx" ! -name "*.component.tsx" ! -name "*.hook.tsx" ! -name "*.context.tsx"
```

### Find folders with colons (should use brackets)

```bash
find src/pages -type d -name "*:*"
```

### Move and update imports

```bash
# Example: Move a file
git mv 'src/pages/old/path/File.tsx' 'src/pages/new/path/File.page.tsx'

# Find all imports to update
grep -r "from.*old/path/File" src/
```

### Verify no broken imports

```bash
# Try to build
yarn run build

# Or check TypeScript
npx tsc --noEmit
```

## Notes for the Agent

- Be systematic: work through one route section at a time
- Always verify that TypeScript imports resolve before moving to the next file
- If uncertain about a file's purpose, examine its imports and exports
- Run automated checks after major structural changes
- Maintain a change log for rollback purposes if needed
