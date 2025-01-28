// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { DisplayName } from '@/components/display-name/DisplayName.component';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';
import { VrackServicesWithIAM } from '@/data';
import '@testing-library/jest-dom';
import { configureIamResponse } from '../../../mocks/iam/iam.mock';
import { IAM_ACTION } from '@/utils/iamActions.constants';

const defaultVs = vrackServicesList[0] as VrackServicesWithIAM;

const queryClient = new QueryClient();

const iamActionsMock = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...original,
    useAuthorizationIam: iamActionsMock,
  };
});

const renderComponent = ({
  isListing,
  vs = defaultVs,
}: {
  isListing?: boolean;
  vs?: VrackServicesWithIAM;
}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <DisplayName isListing={isListing} {...vs} />
    </QueryClientProvider>,
  );
};

describe('DisplayName Component', () => {
  it('In listing, should display the display name with link', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { getByText, queryByTestId } = renderComponent({ isListing: true });

    expect(queryByTestId('display-name-link')).toBeDefined();
    expect(getByText(defaultVs.iam.displayName)).toBeDefined();
    expect(queryByTestId('display-name-edit-button')).toBeNull();
  });

  it('In listing, should display the display name with info icon', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { queryByTestId } = renderComponent({
      isListing: true,
      vs: vrackServicesList[2] as VrackServicesWithIAM,
    });
    expect(queryByTestId('warning-icon')).toBeDefined();
  });

  it('In listing, should display the display name with loader', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { queryByTestId } = renderComponent({
      isListing: true,
      vs: vrackServicesList[3] as VrackServicesWithIAM,
    });
    expect(queryByTestId('vs-loader-operation-in-progress')).toBeDefined();
  });

  it('In Dashboard, should display the display name with edit action', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { getByText, queryByTestId } = renderComponent({});

    expect(getByText(defaultVs.iam.displayName)).toBeDefined();
    expect(queryByTestId('edit-button')).toBeDefined();
    expect(queryByTestId('display-name-link')).toBeNull();
  });

  it('In Dashboard, should display the display name with disabled edit action', async () => {
    iamActionsMock.mockReturnValue(configureIamResponse({}));
    const { queryByTestId } = renderComponent({
      vs: vrackServicesList[2] as VrackServicesWithIAM,
    });
    expect(queryByTestId('edit-button')).toHaveProperty('disabled');
  });

  it('In Dashboard, should display the display name with disabled edit action when user have no iam right', async () => {
    iamActionsMock.mockReturnValue(
      configureIamResponse({
        unauthorizedActions: [IAM_ACTION.VRACK_SERVICES_RESOURCE_EDIT],
      }),
    );
    const { queryByTestId } = renderComponent({
      vs: vrackServicesList[2] as VrackServicesWithIAM,
    });
    expect(queryByTestId('edit-button')).toHaveProperty('disabled');
  });
});
