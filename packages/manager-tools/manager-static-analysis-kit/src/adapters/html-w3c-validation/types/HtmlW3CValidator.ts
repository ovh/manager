/**
 * Represents the result of running the W3C Nu Html Checker (`vnu-jar`).
 */
export interface HtmlW3CValidationResult {
  /**
   * Whether the validation completed without errors.
   *
   * - `true`: the HTML passed validation (no errors).
   * - `false`: validation failed (errors or runtime issue).
   */
  success: boolean;

  /**
   * Standard output from the validator (always normalized to string).
   *
   * Contains information, warnings, or success messages
   * produced by the checker.
   */
  stdout: string;

  /**
   * Standard error from the validator (always normalized to string).
   *
   * Contains error messages if validation fails, or a process-level
   * error message if the checker itself fails to run.
   */
  stderr: string;
}
