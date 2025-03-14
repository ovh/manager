// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  VrackServicesWithIAM,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import { DisplayName } from '@/components/display-name/DisplayName.component';

const defaultVs = vrackServicesListMocks[0] as VrackServicesWithIAM;

const renderComponent = ({
  isListing,
  vs = defaultVs,
}: {
  isListing?: boolean;
  vs?: VrackServicesWithIAM;
}) => {
  return render(<DisplayName isListing={isListing} {...vs} />);
};

describe('DisplayName Component', () => {
  it('In listing, should display the display name with link', async () => {
    const { getByText, queryByTestId } = renderComponent({ isListing: true });

    expect(queryByTestId('display-name-link')).toBeDefined();
    expect(getByText(defaultVs.iam.displayName)).toBeDefined();
    expect(queryByTestId('display-name-edit-button')).toBeNull();
  });

  it('In listing, should display the display name with info icon', async () => {
    const { queryByTestId } = renderComponent({
      isListing: true,
      vs: vrackServicesListMocks[2] as VrackServicesWithIAM,
    });
    expect(queryByTestId('warning-icon')).toBeDefined();
  });

  it('In listing, should display the display name with loader', async () => {
    const { queryByTestId } = renderComponent({
      isListing: true,
      vs: vrackServicesListMocks[3] as VrackServicesWithIAM,
    });
    expect(queryByTestId('vs-loader-operation-in-progress')).toBeDefined();
  });

  it('In Dashboard, should display the display name with edit action', async () => {
    const { getByText, queryByTestId } = renderComponent({});

    expect(getByText(defaultVs.iam.displayName)).toBeDefined();
    expect(queryByTestId('edit-button')).toBeDefined();
    expect(queryByTestId('display-name-link')).toBeNull();
  });

  it('In Dashboard, should display the display name with disabled edit action', async () => {
    const { queryByTestId } = renderComponent({
      vs: vrackServicesListMocks[2] as VrackServicesWithIAM,
    });
    expect(queryByTestId('edit-button')).toHaveProperty('disabled');
  });
});
