import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { shellContext, wrapper } from '@/wrapperRenders';

import PublicIpConnectivity from './PublicIpConnectivity.component';

describe.each`
  ovhSubsidiary | explanation
  ${'FR'}       | ${'kube_common_node_pool_public_connetivity_free_plan_tooltip'}
  ${'US'}       | ${'kube_common_node_pool_public_connetivity_us_tooltip'}
`(
  'given the public connectivity of a Free cluster on the $ovhSubsidiary subsidiary',
  ({ ovhSubsidiary, explanation }: { ovhSubsidiary: string; explanation: string }) => {
    describe('when the section is displayed', () => {
      beforeEach(() => {
        const subsidiaryContext = {
          ...shellContext,
          environment: {
            ...shellContext.environment,
            getUser: () => ({ ...shellContext.environment.getUser(), ovhSubsidiary }),
          },
        } as unknown as ShellContextType;

        render(
          <ShellContext.Provider value={subsidiaryContext}>
            <PublicIpConnectivity price="US$0.0028" />
          </ShellContext.Provider>,
          { wrapper },
        );
      });

      it('offers a keyboard-reachable explanation of how public IPs are assigned and billed', () => {
        expect(screen.getByRole('button', { name: explanation })).toBeInTheDocument();
      });

      it('states the public IP price per node', () => {
        expect(
          screen.getByText('(US$0.0028 / kube_common_node_pool_node)', { exact: false }),
        ).toBeInTheDocument();
      });
    });
  },
);
