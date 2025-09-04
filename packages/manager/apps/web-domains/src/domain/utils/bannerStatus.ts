import {
  DIRECT_FLAGS,
  ERROR_RULES,
  WARNING_RULES,
} from '@/domain/constants/serviceDetail';
import { BannerResult } from '@/domain/types/domainResource';

export function bannerTypeFromFlags(values: string[]): BannerResult {
  const set = new Set(values);

  const err = ERROR_RULES.find((rule) =>
    rule.requiresAll.every((k) => set.has(k)),
  );
  if (err) return err.result;

  const warn = WARNING_RULES.find((rule) =>
    rule.requiresAll.every((k) => set.has(k)),
  );
  if (warn) return warn.result;

  const result = values.map((v) => DIRECT_FLAGS[v]).find(Boolean) as
    | BannerResult
    | undefined;
  return result;
}
