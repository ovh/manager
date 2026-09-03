// Mainland France, Guadeloupe, Martinique and Réunion: the audience the
// container's company information modal covers for the same check.
const SIRET_COUNTRIES = ['FR', 'GP', 'MQ', 'RE'];
const SIRET_REGEX = /^\d{14}$/;
// A SIRET is a SIREN (9 digits) followed by a NIC (5).
const SIREN_LENGTH = 9;
// La Poste: the one SIREN whose SIRETs carry no Luhn checksum.
const LA_POSTE_SIREN = '356000000';
// Never attributed, and a favourite placeholder.
const UNASSIGNED_SIREN = '000000000';

const isLuhnValid = (digits) =>
  digits
    .split('')
    .reverse()
    .reduce((total, digit, index) => {
      const value = index % 2 ? Number(digit) * 2 : Number(digit);
      return total + (value > 9 ? value - 9 : value);
    }, 0) %
    10 ===
  0;

const sumOfDigits = (digits) =>
  digits.split('').reduce((total, digit) => total + Number(digit), 0);

// A SIRET is 14 digits: a SIREN and its NIC. Both the SIREN alone and the 14
// digits as a whole carry a Luhn checksum, and since the two double different
// positions, passing one says nothing about the other: check both.
export const isSiretValid = (siret) => {
  if (!siret || !SIRET_REGEX.test(siret)) {
    return false;
  }
  const siren = siret.slice(0, SIREN_LENGTH);
  // Luhn cannot catch a zeroed SIREN: its digits add up to 0, which is a
  // multiple of 10. It is never attributed, so turn it away on its own.
  if (siren === UNASSIGNED_SIREN) {
    return false;
  }
  if (!isLuhnValid(siren)) {
    return false;
  }
  // La Poste is the documented exception: no Luhn on its SIRETs, their digits
  // add up to a multiple of 5 instead. Accept either rather than hold a real
  // customer's invoices back on a checksum they were never meant to carry.
  if (siret.startsWith(LA_POSTE_SIREN)) {
    return sumOfDigits(siret) % 5 === 0 || isLuhnValid(siret);
  }
  return isLuhnValid(siret);
};

// These companies owe a SIRET: without a valid one their invoices cannot be
// issued through an approved platform, so the PDF stays out of reach until they
// fill it in. Kept in sync with the container's company information modal
// (apps/container/src/components/company-information-modal), which decides on
// the same audience.
export const isSiretMissingOrInvalid = (user) =>
  user.legalform === 'corporation' &&
  SIRET_COUNTRIES.includes(user.country) &&
  !isSiretValid(user.companyNationalIdentificationNumber);
