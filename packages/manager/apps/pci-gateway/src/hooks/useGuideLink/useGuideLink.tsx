import { useContext, useMemo } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { GUIDES } from './useGuideLink.constants';

type TGetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

type TUseGuideLinkProps = {
  [guideName in keyof typeof GUIDES]: string;
};

function getGuideListLink({ subsidiary }: TGetGuideLinkProps) {
  return Object.fromEntries(
    Object.entries(GUIDES).map(([key, value]) => [
      key,
      value[subsidiary] ?? value.DEFAULT,
    ]),
  ) as TUseGuideLinkProps;
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
