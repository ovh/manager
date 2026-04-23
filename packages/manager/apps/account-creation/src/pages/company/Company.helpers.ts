export const calculateFRVATNumber = (siren: string): string | null => {
  const parsedSiren = Number.parseInt(siren, 10);
  if (siren.length !== 9 || Number.isNaN(parsedSiren)) {
    return null;
  }
  const checksum = String((12 + 3 * (parsedSiren % 97)) % 97).padStart(2, '0');
  return `FR${checksum}${siren}`;
};
