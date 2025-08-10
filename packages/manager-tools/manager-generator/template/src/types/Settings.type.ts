/**
 * Settings.types.ts
 * -----------------------------------------------------------------------------
 * Type definitions for settings form values.
 */

/**
 * Values captured by the Settings form.
 *
 * @remarks
 * Used with `react-hook-form` in `SettingsPage` to type-check form state
 * and submissions.
 */
export type SettingsFormValuesType = {
  /** Project name entered by the user (required). */
  projectName: string;

  /** Optional project description. */
  description: string;
};
