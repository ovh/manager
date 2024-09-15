import React from 'react';
import { describe, it, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import listingTranslation from '../../../public/translations/listing/Messages_fr_FR.json';
import Listing, { ListingProps } from './Listing.page';
import { render } from '../../utils/test/test.provider';
import { RancherService, RancherTaskType } from '../../types/api.type';
import { rancherMocked } from '../../_mock_/rancher';

const defaultProps = {
  data: [rancherMocked],
  refetchRanchers: vi.fn(),
};

const setupSpecTest = (props: ListingProps = defaultProps) => () =>
  waitFor(() => render(<Listing {...props} />));

describe('Listing Page', () => {
  it('Page should display correctly', async () => {
    setupSpecTest({
      data: [
        {
          id: '123',
          currentState: { name: 'Rancher1' },
          currentTasks: [],
        } as RancherService,
      ],
      refetchRanchers: vi.fn(),
    });

    waitFor(() => {
      const title = screen.getByText(listingTranslation.rancherTitle);
      expect(title).not.toBeNull();
    });
  });

  describe("Given that I'm a Public Cloud user without any Rancher service", () => {
    it('Should display the onboarding page', async () => {
      setupSpecTest({
        data: [] as RancherService[],
        refetchRanchers: vi.fn(),
      });
      waitFor(() => {
        const title = screen.queryByText('title');
        expect(title).toBeNull();
      });
    });
  });

  it('Should not display banner message when there is no task', async () => {
    setupSpecTest();
    const deletingMessage = screen.queryByText(
      listingTranslation.rancherStatusDeleting,
    );
    const creatingMessage = screen.queryByText(
      listingTranslation.rancherStatusCreating,
    );

    expect(deletingMessage).not.toBeInTheDocument();
    expect(creatingMessage).not.toBeInTheDocument();
  });

  it('Should display banner deleting message when deleting is pending', async () => {
    setupSpecTest({
      data: [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_DELETE }],
        },
      ],
      refetchRanchers: vi.fn(),
    });
    waitFor(() => {
      const deletingMessage = screen.queryByText(
        listingTranslation.rancherStatusDeleting,
      );
      const creatingMessage = screen.queryByText(
        listingTranslation.rancherStatusCreating,
      );
      expect(deletingMessage).toBeInTheDocument();
      expect(creatingMessage).not.toBeInTheDocument();
    });
  });

  it('Should display banner creating message when creating is pending', async () => {
    setupSpecTest({
      data: [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_CREATE }],
        },
      ],
      refetchRanchers: vi.fn(),
    });
    waitFor(() => {
      const deletingMessage = screen.queryByText(
        listingTranslation.rancherStatusDeleting,
      );
      const creatingMessage = screen.queryByText(
        listingTranslation.rancherStatusCreating,
      );
      expect(deletingMessage).not.toBeInTheDocument();
      expect(creatingMessage).toBeInTheDocument();
    });
  });
});
