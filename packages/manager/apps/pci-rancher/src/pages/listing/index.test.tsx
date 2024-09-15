import React from 'react';
import { describe, it, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../utils/test/test.provider';
import { RancherService, RancherTaskType } from '../../types/api.type';
import listingTranslation from '../../../public/translations/listing/Messages_fr_FR.json';
import { rancherMocked } from '../../_mock_/rancher';
import Listing, { ListingProps } from './Listing.page';

const defaultProps = {
  data: [rancherMocked],
  refetchRanchers: vi.fn(),
};

const setupSpecTest = (props: ListingProps = defaultProps) => () =>
  render(<Listing {...props} />);

describe('Listing Page', () => {
  const rancherToTest = (data, expectWait) => {
    setupSpecTest({
      data,
      refetchRanchers: vi.fn(),
    });
    expectWait();
  };
  it('Page should display correctly 2', async () => {
    rancherToTest(
      [
        {
          id: '123',
          currentState: { name: 'Rancher1' },
          currentTasks: [],
        } as RancherService,
      ],
      () => {
        waitFor(() => {
          const title = screen.getByText(listingTranslation.rancherTitle);
          expect(title).not.toBeNull();
        });
      },
    );
  });

  describe("Given that I'm a Public Cloud user without any Rancher service", () => {
    it('Should display the onboarding page', async () => {
      rancherToTest([], () => {
        waitFor(() => {
          const title = screen.queryByText('title');
          expect(title).toBeNull();
        });
      });
    });
  });

  it('Should not display banner message when there is no task', async () => {
    rancherToTest([], () => {
      waitFor(() => {
        const deletingMessage = screen.queryByText(
          listingTranslation.rancherStatusDeleting,
        );
        const creatingMessage = screen.queryByText(
          listingTranslation.rancherStatusCreating,
        );

        expect(deletingMessage).not.toBeInTheDocument();
        expect(creatingMessage).not.toBeInTheDocument();
      });
    });
  });

  it('Should display banner deleting message when deleting is pending', async () => {
    rancherToTest(
      [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_DELETE }],
        },
      ],
      () => {
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
      },
    );
  });

  it('Should display banner creating message when creating is pending', async () => {
    rancherToTest(
      [
        {
          ...rancherMocked,
          currentTasks: [{ id: '1', type: RancherTaskType.RANCHER_CREATE }],
        },
      ],
      () => {
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
      },
    );
  });
});
