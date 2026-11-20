import { Rule } from '@/types/rule';
import {
  GermanRegisterCourt,
  GermanRegisterCourtList,
  RegisterTypeEnum,
} from '@/types/suggestion';

/*
 * Germany (spec « 06 Germany Customer Master Data: Front End », MANAGER-23141):
 * only what `POST /newAccount/rules` cannot say. Which identifiers a legal form
 * shows, their formats and whether they are mandatory stay the rules'.
 *
 * Ported from `@ovhcloud/manager-account-rules` `countries/de`
 * (manager-gcj-account, `packages/libs/account-rules/src/countries/de/index.ts`),
 * same names and behaviour: keep both in sync.
 */

type Rules = Partial<Record<string, Rule>>;

/** The identifiers of a German account: USt-IdNr., W-IdNr., register id. */
export const IDENTIFIER_FIELDS = [
  'vat',
  'nationalIdentificationNumber',
  'companyNationalIdentificationNumber',
] as const;

/** The German register types in their canonical spelling (`GnR`, `HRB`…). */
export const REGISTER_TYPES: readonly string[] = Object.values(
  RegisterTypeEnum,
);

/** Organisations: company, sole trader, non-profit, public administration. */
const ORGANISATION_LEGAL_FORMS = [
  'corporation',
  'personalcorporation',
  'association',
  'administration',
];

export const cleanIdentifier = (value?: string | null): string =>
  (value ?? '').replace(/\s/g, '');

/** Case-insensitive: the country comes from forms and `/me`. */
export const isGermany = (country?: string | null): boolean =>
  (country ?? '').toUpperCase() === 'DE';

/**
 * THE German scope (spec §1): a German head office and an organisation. An
 * individual gives no identifier; « other » is a legacy form, out of the spec.
 */
export const isScope = (
  country?: string | null,
  legalform?: string | null,
): boolean =>
  isGermany(country) && ORGANISATION_LEGAL_FORMS.includes(legalform ?? '');

/** Spec §1: only a Company must give at least one identifier. */
export const requiresIdentifier = (legalform?: string | null): boolean =>
  legalform === 'corporation';

/**
 * Spec §1: a Company gives at least one of W-IdNr., register id or
 * USt-IdNr. — the « no USt-IdNr. » box is not one. Only when its rules ask
 * one of them. `values` as `PUT /me` stores them: the VAT `''` once the box is
 * ticked, the register id an EUID (`''` while incomplete).
 */
export const isIdentifierMissing = (
  legalform: string | null | undefined,
  values: Readonly<Record<string, string | undefined>>,
  rules: Rules,
): boolean =>
  requiresIdentifier(legalform) &&
  IDENTIFIER_FIELDS.some((field) => !!rules[field]) &&
  IDENTIFIER_FIELDS.every((field) => !cleanIdentifier(values[field]));

/** A `GET /me` value as text: `null` / `undefined` → `''`. */
const storedText = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value);

/**
 * Spec §7: sends empty every identifier the rules of the category no longer
 * describe while `/me` holds it (public administration: the register id;
 * individual: all three).
 */
export const droppedIdentifiers = (
  rules: Rules,
  current: unknown,
): Record<string, string> =>
  Object.fromEntries(
    IDENTIFIER_FIELDS.filter(
      (field) =>
        !rules[field] &&
        storedText(
          (current as Record<string, unknown> | null | undefined)?.[field],
        ),
    ).map((field) => [field, '']),
  );

// ---- Register id (EUID) -------------------------------------------------

/**
 * The register type a typed number starts with, in its canonical spelling
 * (`gnr 12` → `GnR`); `null` when it starts with none of `registerTypes`.
 */
export const registerTypeOf = (
  number: string,
  registerTypes: readonly string[],
): string | null => {
  const typed = cleanIdentifier(number).toUpperCase();
  return (
    [...registerTypes]
      .sort((a, b) => b.length - a.length)
      .find((type) => typed.startsWith(type.toUpperCase())) ?? null
  );
};

/**
 * The EUID (spec §4): `DE` + court code + `.` + register type and number, no
 * spaces, upper case but the register type in its canonical spelling
 * (`D2601V` + `hrb 12345` → `DED2601V.HRB12345`). `''` unless both parts are
 * given (`registerIdIssue` refuses one alone). Its format is the rules' check.
 */
export const toEuid = (
  court: string,
  number: string,
  registerTypes: readonly string[],
): string => {
  const typed = cleanIdentifier(number);
  if (!court || !typed) return '';
  const type = registerTypeOf(typed, registerTypes);
  const register = type
    ? `${type}${typed.slice(type.length).toUpperCase()}`
    : typed.toUpperCase();
  return `DE${court}.${register}`;
};

/** Spec §4: the court and the number both, or neither. */
export const registerIdIssue = (
  court: string,
  number: string,
): 'courtRequired' | 'numberRequired' | null => {
  const typed = !!cleanIdentifier(number);
  if (typed && !court) return 'courtRequired';
  if (court && !typed) return 'numberRequired';
  return null;
};

export type CourtOption = {
  code: string;
  /** The court name, followed by its code when the list holds it twice. */
  name: string;
  /** `false` for the current court when the list does not offer it. */
  offered: boolean;
};

/**
 * The courts to pick from (spec §4): those keeping the register type typed,
 * all of them before one is typed. The current court, when not offered
 * (another register type typed after it was picked), comes last with
 * `offered: false` — whether a court keeps a register is the back end's
 * check, not the form's.
 */
export const courtOptions = (
  list: GermanRegisterCourtList,
  number: string,
  current: string,
): CourtOption[] => {
  const type = registerTypeOf(number, list.registerTypes);
  const offered = type
    ? list.courts.filter((court) =>
        (court.registers as readonly string[]).includes(type),
      )
    : list.courts;
  const count = new Map<string, number>();
  list.courts.forEach((court) => {
    count.set(court.name, (count.get(court.name) ?? 0) + 1);
  });
  const named = (court: GermanRegisterCourt) =>
    (count.get(court.name) ?? 0) > 1
      ? `${court.name} (${court.code})`
      : court.name;
  const options = offered.map((court) => ({
    code: court.code,
    name: named(court),
    offered: true,
  }));
  if (!current || offered.some((court) => court.code === current)) {
    return options;
  }
  const known = list.courts.find((court) => court.code === current);
  return [
    ...options,
    { code: current, name: known ? named(known) : current, offered: false },
  ];
};
