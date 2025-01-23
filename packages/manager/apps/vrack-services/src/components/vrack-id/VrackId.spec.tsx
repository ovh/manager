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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { VrackId } from './VrackId.component';
import { VrackServicesWithIAM } from '@/data';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';
import { configureIamResponse } from '../../../mocks/iam/iam.mock';
import { IAM_ACTION } from '@/utils/iamActions.constants';

const defaultVs = vrackServicesList[5] as VrackServicesWithIAM;
const vsWithoutVrack = vrackServicesList[0] as VrackServicesWithIAM;

const queryClient = new QueryClient();

const iamActionsMock = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...original,
    useAuthorizationIam: iamActionsMock,
  };
});

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
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <VrackId isListing={isListing} {...vs} />
      </ShellContext.Provider>
      ,
    </QueryClientProvider>,
  );
};

/** END RENDER */

describe('VrackId Component', () => {
  it('should display link to vrack if associated', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
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

  it('should display disable link to vrack if user has no iam right', async () => {
    iamActionsMock.mockReturnValue(
      configureIamResponse({
        unauthorizedActions: [IAM_ACTION.VRACK_SERVICES_VRACK_ATTACH],
      }),
    );
    const { container } = renderComponent({ vs: defaultVs });

    await getButtonByLabel({
      container,
      label: 'vrackActionAssociateToAnother',
      disabled: true,
    });
  });

  it('should display action to link vrack if not associated', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { getByText, queryByText } = renderComponent({ vs: vsWithoutVrack });

    await waitFor(() => {
      expect(queryByText('vrackActionAssociateToAnother')).toBeNull();
      expect(queryByText('vrackActionDissociate')).toBeNull();
      expect(getByText('associateVrackButtonLabel')).toBeDefined();
    });
  });
});
