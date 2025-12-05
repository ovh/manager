import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { GUIDE_LINKS, TGuideKey } from './useGuideLink.constant';
import { Subsidiary } from '@ovh-ux/manager-config';

const getGuideLink = (key: TGuideKey, ovhSubsidiary: Subsidiary) =>
  GUIDE_LINKS[key][ovhSubsidiary] ?? GUIDE_LINKS[key].DEFAULT;

export function useGuideLink(key: TGuideKey): string;
export function useGuideLink(keys: TGuideKey[]): Record<TGuideKey, string>;
export function useGuideLink(keys: TGuideKey | TGuideKey[]) {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return Array.isArray(keys)
    ? keys.reduce(
        (prev, currentKey) => ({
          ...prev,
          [currentKey]: getGuideLink(currentKey, ovhSubsidiary),
        }),
        {} as Record<TGuideKey, string>,
      )
    : getGuideLink(keys, ovhSubsidiary);
}
