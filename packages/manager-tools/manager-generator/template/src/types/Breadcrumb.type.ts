/**
 * Breadcrumb.types.ts
 * -----------------------------------------------------------------------------
 * Shared type definitions for breadcrumb components and hooks.
 */

/**
 * Custom breadcrumb event type.
 *
 * @remarks
 * Extends the standard DOM `Event` with additional breadcrumb-specific flags.
 *
 * - `isCollapsed`: True if the breadcrumb item was collapsed (hidden behind "…").
 * - `isLast`: True if the breadcrumb item is the last element in the trail.
 */
type BreadcrumbEventType = Event & {
  target: { isCollapsed?: boolean; isLast?: boolean };
};

/**
 * Single breadcrumb item definition.
 *
 * @remarks
 * Represents one element in the breadcrumb trail. Each item may link to a page
 * or trigger a custom handler.
 */
export type BreadcrumbItemType = {
  /** Optional unique identifier for React keying. */
  id?: string;
  /** Display label shown in the breadcrumb. */
  label?: string;
  /** Hyperlink for navigation (if applicable). */
  href?: string;
  /**
   * Custom click handler for this breadcrumb.
   *
   * @param event - Extended breadcrumb event containing collapse/position info.
   */
  onClick?: (event?: BreadcrumbEventType) => void;
};

/**
 * Props for breadcrumb components.
 *
 * @remarks
 * Allows customization of the root label, app name prefix, and item list.
 */
export interface BreadcrumbProps {
  /** Override for the first (root) breadcrumb label. */
  customRootLabel?: string;
  /** Default label for the root breadcrumb (if no custom label). */
  rootLabel?: string;
  /** Application name to display as a prefix/root breadcrumb. */
  appName?: string;
  /** List of breadcrumb items to render (after root). */
  items?: BreadcrumbItemType[];
}
