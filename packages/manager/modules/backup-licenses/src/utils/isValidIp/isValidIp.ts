/**
 * Validation d'adresse IP (IPv4 ou IPv6) pour le tunnel de commande (BKP-1208).
 * Remplace la regex laxiste de la maquette. Cf. spec BKP-1208-order-funnel.md.
 */

const IPV4_OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4_REGEX = new RegExp(`^(${IPV4_OCTET}\\.){3}${IPV4_OCTET}$`);

/** Valide une IPv4 pointée décimale, chaque octet dans [0,255]. */
export function isValidIpv4(value: string): boolean {
  return IPV4_REGEX.test(value.trim());
}

/**
 * Valide une IPv6, incluant les formes compressées (`::`), l'adresse bouclée
 * et les formes IPv4-mapped (`::ffff:192.168.0.1`).
 */
export function isValidIpv6(value: string): boolean {
  const address = value.trim();
  if (!address.includes(':')) {
    return false;
  }

  // Une seule compression "::" autorisée.
  const doubleColonCount = (address.match(/::/g) || []).length;
  if (doubleColonCount > 1) {
    return false;
  }

  const hasCompression = doubleColonCount === 1;
  const parts = address.split('::');
  const head = parts[0] ?? '';
  const tail = parts[1] ?? '';
  const headGroups = head === '' ? [] : head.split(':');
  const tailGroups = tail === '' ? [] : tail.split(':');
  const groups = [...headGroups, ...tailGroups];

  const isHextet = (group: string) => /^[0-9a-fA-F]{1,4}$/.test(group);

  // Le dernier groupe peut être une IPv4 embarquée (compte pour 2 hextets).
  let hextetCount = 0;
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i];
    if (group === undefined) {
      return false;
    }
    const isLast = i === groups.length - 1;
    if (isLast && isValidIpv4(group)) {
      hextetCount += 2;
    } else if (isHextet(group)) {
      hextetCount += 1;
    } else {
      return false;
    }
  }

  if (hasCompression) {
    // "::" doit remplacer au moins un groupe → total strictement < 8.
    return hextetCount < 8;
  }
  return hextetCount === 8;
}

/** Valide une adresse IPv4 OU IPv6. */
export function isValidIp(value: string): boolean {
  return isValidIpv4(value) || isValidIpv6(value);
}
