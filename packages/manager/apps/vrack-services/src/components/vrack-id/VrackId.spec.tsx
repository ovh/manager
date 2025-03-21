// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  VrackServicesWithIAM,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import { VrackId } from './VrackId.component';

const defaultVs = vrackServicesListMocks[5] as VrackServicesWithIAM;
const vsWithoutVrack = vrackServicesListMocks[0] as VrackServicesWithIAM;

/** Render */

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
  shell: {
    tracking: {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      init: vi.fn(),
    },
    navigation: {
      getURL: vi.fn().mockResolvedValue('link-to-vrack'),
    },
  },
};

const renderComponent = ({
  isListing,
  vs,
}: {
  isListing?: boolean;
  vs: VrackServicesWithIAM;
}) => {
  return render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <VrackId isListing={isListing} {...vs} />
    </ShellContext.Provider>,
  );
};

/** END RENDER */

describe('VrackId Component', () => {
  it('should display link to vrack if associated', async () => {
    const { getByText, queryByText } = renderComponent({ vs: defaultVs });

    await waitFor(() => {
      expect(getByText(defaultVs.currentState.vrackId)).toBeDefined();
      expect(getByText(defaultVs.currentState.vrackId)).toHaveAttribute(
        'href',
        'link-to-vrack',
      );
      expect(getByText('vrackActionAssociateToAnother')).toBeDefined();
      expect(getByText('vrackActionDissociate')).toBeDefined();
      expect(queryByText('associateVrackButtonLabel')).toBeNull();
    });
  });

  it('should display action to link vrack if not associated', async () => {
    const { getByText, queryByText } = renderComponent({ vs: vsWithoutVrack });

    await waitFor(() => {
      expect(queryByText('vrackActionAssociateToAnother')).toBeNull();
      expect(queryByText('vrackActionDissociate')).toBeNull();
      expect(getByText('associateVrackButtonLabel')).toBeDefined();
    });
  });
});
