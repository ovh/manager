export function normalizeAccountId(inputStr: string): string {
  const nicOrEmail = inputStr.trim();
  if (nicOrEmail === '') {
    return '';
  }
  if (/[@.]+/.test(nicOrEmail)) {
    return nicOrEmail;
  }
  return nicOrEmail.endsWith('-ovh') ? nicOrEmail : `${nicOrEmail}-ovh`;
}
