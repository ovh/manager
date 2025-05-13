import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { GUIDE_LINKS } from './useGuideLink.constant';

type TGetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

type UseGuideLinkProps = {
  [guideName in keyof typeof GUIDE_LINKS]: string;
};

function getGuideListLink({ subsidiary }: TGetGuideLinkProps) {
  return Object.fromEntries(
    Object.entries(GUIDE_LINKS).map(([key, value]) => [
      key,
      value[subsidiary] ?? value.DEFAULT,
    ]),
  ) as UseGuideLinkProps;
}

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
