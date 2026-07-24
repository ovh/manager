/**
 * Whether a `PUT /me` save error is the RG6 "e-invoicing address no longer
 * active in the PPF directory" case: the directory is refreshed daily at 6am,
 * so an address valid when the rules were fetched can be rejected at save time
 * with a 400. When it happens we re-fetch the rules and ask for a new selection.
 *
 * TODO(back): refine with the backend's specific error code once available,
 * instead of the "any 400 while an address was selected" heuristic.
 */
export const isEinvoicingStaleAddressError = (
  error: unknown,
  hadEinvoicingSelection: boolean,
): boolean => {
  if (!hadEinvoicingSelection) return false;
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { status?: number }).status === 400
  );
};
