import React from 'react';
import { vi } from 'vitest';

import { render, waitFor } from '../../utils/test/test.provider';
import { RancherService, RancherTaskType } from '@/types/api.type';
import listingTranslation from '../../../public/translations/listing/Messages_fr_FR.json';
import { rancherMocked } from '../../__mocks__/rancher';
import Listing, { ListingProps } from './Listing.page';

const defaultProps = {
  data: [rancherMocked],
  refetchRanchers: vi.fn(),
};

vi.mock('@ovh-ux/manager-react-components', async () => {
  const module = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...module,
    ChangelogButton: () => <div>ChangelogButton</div>,
  };
});

const setupSpecTest = async (props: ListingProps = defaultProps) =>
  waitFor(() => render(<Listing {...props} />));

describe('Listing Page', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest({
      data: [{ ...rancherMocked }],
      refetchRanchers: vi.fn(),
    });

    const title = screen.getByText(listingTranslation.rancherTitle);

    expect(title).not.toBeNull();
  });

  describe("Given that I'm a Public Cloud user without any Rancher service", () => {
    it('Should display the onboarding page', async () => {
      const screen = await setupSpecTest({
        data: [] as RancherService[],
        refetchRanchers: vi.fn(),
      });

      const title = screen.queryByText('title');

      expect(title).toBeNull();
    });
  });

  it('Should not display banner message when there is no task', async () => {
    const { queryByText } = await setupSpecTest();
    const deletingMessage = queryByText(
      listingTranslation.rancherStatusDeleting,
    );
    const creatingMessage = queryByText(
      listingTranslation.rancherStatusCreating,
    );

    expect(deletingMessage).not.toBeInTheDocument();
    expect(creatingMessage).not.toBeInTheDocument();
  });

  it('Should display banner deleting message when deleting is pending', async () => {
    const { queryByText } = await setupSpecTest({
      data: [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_DELETE }],
        },
      ],
      refetchRanchers: vi.fn(),
    });
    const deletingMessage = queryByText(
      listingTranslation.rancherStatusDeleting,
    );
    const creatingMessage = queryByText(
      listingTranslation.rancherStatusCreating,
    );

    expect(deletingMessage).toBeInTheDocument();
    expect(creatingMessage).not.toBeInTheDocument();
  });

  it('Should display banner creating message when creating is pending', async () => {
    const { queryByText } = await setupSpecTest({
      data: [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_CREATE }],
        },
      ],
      refetchRanchers: vi.fn(),
    });
    const deletingMessage = queryByText(
      listingTranslation.rancherStatusDeleting,
    );
    const creatingMessage = queryByText(
      listingTranslation.rancherStatusCreating,
    );

    expect(deletingMessage).not.toBeInTheDocument();
    expect(creatingMessage).toBeInTheDocument();
  });
});
