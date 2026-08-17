import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

/**
 * L'API renvoie les IP en notation CIDR (`203.0.113.10/32`). Un masque d'hôte unique
 * n'apporte aucune information dans une colonne « IP publique » et alourdit la lecture :
 * on le retire. Tout autre préfixe est conservé, il porte une information de plage.
 */
const IPV4_HOST_PREFIX = '/32';
const IPV6_HOST_PREFIX = '/128';

const stripHostPrefix = (ip: string): string => {
  const isIpv6 = ip.includes(':');
  const hostPrefix = isIpv6 ? IPV6_HOST_PREFIX : IPV4_HOST_PREFIX;
  return ip.endsWith(hostPrefix) ? ip.slice(0, -hostPrefix.length) : ip;
};

/** Formate une liste d'IP CIDR en une chaîne affichable, ou le placeholder si vide. */
export const formatIpList = (ips?: string[]): string => {
  const formatted = (ips ?? [])
    .map((ip) => ip.trim())
    .filter(Boolean)
    .map(stripHostPrefix);

  return formatted.length ? formatted.join(', ') : EMPTY_VALUE_PLACEHOLDER;
};

/**
 * Démasque le premier élément d'un tableau d'IP CIDR, pour pré-remplir un champ texte
 * d'édition (BKP-1218) — un seul champ par type d'IP, sur le modèle du tunnel de commande.
 * Tableau vide ou absent : chaîne vide (pas de placeholder, ce n'est pas de l'affichage).
 */
export const firstIpWithoutMask = (ips?: string[]): string => {
  const [first] = (ips ?? []).map((ip) => ip.trim()).filter(Boolean);
  return first ? stripHostPrefix(first) : '';
};
