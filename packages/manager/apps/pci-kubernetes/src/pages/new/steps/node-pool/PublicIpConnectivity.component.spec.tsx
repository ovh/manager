import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import PublicIpConnectivity from './PublicIpConnectivity.component';

describe('given the public connectivity of a Free cluster', () => {
  describe('when the section is displayed', () => {
    beforeEach(() => {
      render(<PublicIpConnectivity price="US$0.0028" />, { wrapper });
    });

    it('offers a keyboard-reachable explanation of how public IPs are assigned and billed', () => {
      expect(
        screen.getByRole('button', {
          name: 'kube_common_node_pool_public_connetivity_free_plan_tooltip',
        }),
      ).toBeInTheDocument();
    });

    it('states the public IP price per node', () => {
      expect(
        screen.getByText('(US$0.0028 / kube_common_node_pool_node)', { exact: false }),
      ).toBeInTheDocument();
    });
  });
});
