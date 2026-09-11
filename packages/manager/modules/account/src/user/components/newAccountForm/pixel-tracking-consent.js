/**
 * Pixel-tracking consent — the framework-free part of the feature.
 *
 * Nothing here touches AngularJS, `this.model` or the DOM, so the account
 * edition form (this folder) and the account creation screen
 * (apps/account-creation, step 2) can both use it as is. Keep it that way: the
 * rule object, the broadcasts and the field component are the Angular-only
 * wiring and they live in the files next door.
 */

/**
 * Countries the pixel-tracking checkbox is offered in: France and Italy only,
 * France meaning ALL of its territory — overseas departments, regions and
 * collectivities included, not just the metropolitan mainland.
 *
 * !! THE EXACT CODE LIST IS STILL OPEN (business Open Questions item 10).
 * !! THIS ARRAY IS THE ONLY THING TO EDIT when it is settled.
 *
 * Permanent business scope, not a rollout state: no feature flag guards it,
 * and the consent API exposes no "is eligible" flag — the registered country
 * is all it takes.
 *
 * The 13 French codes are not invented: they are exactly the codes this form's
 * own country enum labels group as France (the 13 signup_enum_country_* keys
 * whose label starts with "France - " in translations/Messages_fr_FR.json).
 *
 * Deliberately NOT FR_COUNTRIES (new-account-form-component.constants.js).
 * That list is the French e-invoicing / SIRET / PPF-directory scope (DROM
 * only) and omits BL, MF, PM, WF, PF, NC and TF; widening it would switch the
 * SIRET lookup and the e-invoicing address picker on for New Caledonia and
 * French Polynesia — a regression in an unrelated, regulated feature. Two
 * different business rules that merely overlap. Do not "deduplicate" them.
 */
export const PIXEL_TRACKING_COUNTRIES = [
  // France - Métropole
  'FR',
  // France - overseas departments and regions
  'GP', // Guadeloupe
  'MQ', // Martinique
  'GF', // French Guiana
  'RE', // Reunion
  'YT', // Mayotte
  // France - overseas collectivities
  'BL', // Saint-Barthélemy
  'MF', // Saint-Martin
  'PM', // Saint-Pierre-et-Miquelon
  'WF', // Wallis-et-Futuna
  'PF', // French Polynesia
  'NC', // New Caledonia
  'TF', // French Southern Territories
  // Italy. No territory variant: San Marino and the Vatican are other
  // countries, even though they bill through the IT subsidiary.
  'IT',
];

/**
 * The whole country decision. Fails closed on purpose — an account with no
 * country, or with the 'UNKNOWN' placeholder, is not offered the checkbox.
 * Never express this as a negated exclusion list: that would fail open.
 * Case is normalised because the creation screen reads the code from another
 * source than GET /me.
 */
export const isPixelTrackingCountry = (country) =>
  PIXEL_TRACKING_COUNTRIES.includes(String(country || '').toUpperCase());

/**
 * `pixel.value` of GET /me/consent/<campaign>/decision drives the checkbox.
 * `pixel.history` is the CNIL audit trail, not a UI need: it is deliberately
 * never read, here or anywhere else. Optional chaining throughout, so a
 * backend that has not shipped `pixel` yet reads as denied instead of throwing
 * inside a GET whose rejection blanks the entire form.
 *
 * `&& decision?.value` is not redundant: business rule 9 makes pixel tracking
 * meaningless without marketing email consent, and a decision that carries
 * `{ value: false, pixel: { value: true } }` — stale data, or a revocation
 * applied to the email decision before the backend cascade shipped — must not
 * be reported as granted. Rendering it verbatim would tick a checkbox that
 * the email gate simultaneously DISABLES, i.e. a consent the customer cannot
 * withdraw from this screen (GDPR art. 7(3) requires withdrawal to be as easy
 * as granting). Reading the pair as denied renders it unchecked instead, and
 * keeps the one loaded state used by both the checkbox and the submit-time
 * payload identical.
 */
export const readPixelConsent = (decision) =>
  !!decision?.pixel?.value && !!decision?.value;

/**
 * Body of PUT /me/consent/<campaign>/decision.
 *
 * Both checkbox states travel together in ONE request rather than two
 * sequential calls: the API applies the email decision first, so a pair sent
 * together can never be refused, it reads clearer and it saves a round trip.
 *
 * `pixel` is omitted entirely — never sent as `false` — in the two cases the
 * contract has no row for:
 *
 *   - an account out of the country scope, which keeps sending exactly the
 *     `{ value }` body it sends today;
 *   - a revocation of marketing email consent, `{ value: false }`, which the
 *     contract documents as "the backend cascades pixel to denied for you".
 *
 * That second omission is what keeps every body this function can build to
 * one of the four rows the contract enumerates. Sending the undocumented
 * `{ value: false, pixel: { value: false } }` instead would be the single most
 * common save an FR/IT customer makes when unsubscribing, on a validator we
 * do not control — and the one refusal the contract does document on this
 * route fails the WHOLE request, email consent included.
 *
 * It also makes the refused pair `{ value: false, pixel: { value: true } }`
 * unrepresentable rather than merely unreachable: no code path here or in the
 * creation screen can emit a `pixel` key while `value` is false, whatever
 * state the caller holds.
 */
export const buildConsentDecisionPayload = ({
  hasEmailConsent,
  isPixelTrackingAvailable,
  hasPixelConsent,
}) => ({
  value: !!hasEmailConsent,
  ...(isPixelTrackingAvailable && hasEmailConsent
    ? { pixel: { value: !!hasPixelConsent } }
    : {}),
});
