import { StatusDetails } from '@/domain/types/domainResource';

export function domainStatusToBadge(
  mapping: Record<string, StatusDetails>,
  value: string,
): StatusDetails | undefined {
  const valueLower = value.toLowerCase();
  const find = Object.keys(mapping).find((val) => {
    return val.toLowerCase() === valueLower;
  });
  return find ? mapping[find] : undefined;
}
