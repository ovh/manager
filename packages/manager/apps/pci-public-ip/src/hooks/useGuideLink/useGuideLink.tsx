import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { GUIDES } from './useGuideLink.constants';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

type UseGuideLinkProps = {
  [guideName: string]: string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  return Object.entries(GUIDES).reduce<UseGuideLinkProps>(
    (result, [key, value]) => ({
      ...result,
      [key]: value[subsidiary] ?? value.DEFAULT,
    }),
    {},
  );
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
