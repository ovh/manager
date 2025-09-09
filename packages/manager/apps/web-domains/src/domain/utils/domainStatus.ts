import { StatusDetails } from '@/domain/types/domainResource';

export function domainStatusToBadge(
  mapping: Record<string, StatusDetails>,
  value: string,
): StatusDetails {
  const find = Object.keys(mapping).find((val) => val === value);
  return find ? mapping[find] : undefined;
}
