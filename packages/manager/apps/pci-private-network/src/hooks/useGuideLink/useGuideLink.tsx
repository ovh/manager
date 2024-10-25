import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { GUIDE_LINKS } from './useGuideLink.constant';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  return Object.entries(GUIDE_LINKS).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: value[subsidiary] ?? value.DEFAULT,
    }),
    {} as { [guideName: string]: string },
  );
}

export type UseGuideLinkProps = {
  [guideName: string]: string;
};

export default function useGuideLink() {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useMemo(
    () =>
      getGuideListLink({
        subsidiary: ovhSubsidiary as OvhSubsidiary,
      }),
    [ovhSubsidiary],
  );
}
