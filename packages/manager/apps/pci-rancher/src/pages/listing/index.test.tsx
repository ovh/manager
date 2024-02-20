import React from 'react';
import Listing, { ListingProps } from './index';
import { render, waitFor } from '../../utils/test/test.provider';
import { RancherService } from '../../api/api.type';
import listingTranslation from '../../public/translations/pci-rancher/listing/Messages_fr_FR.json';
import { rancherMocked } from '../../_mock_/rancher';

const defaultProps = {
  data: [rancherMocked],
  refetchRanchers: jest.fn(),
};

const setupSpecTest = async (props: ListingProps = defaultProps) =>
  waitFor(() => render(<Listing {...props} />));

describe('Listing Page', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest({
      data: [
        { id: '123', currentState: { name: 'Rancher1' } } as RancherService,
      ],
      refetchRanchers: jest.fn(),
    });

    const title = screen.getByText(listingTranslation.rancherTitle);

    expect(title).not.toBeNull();
  });

  describe("Given that I'm a Public Cloud user without any Rancher service", () => {
    it('Should display the onboarding page', async () => {
      const screen = await setupSpecTest({
        data: [] as RancherService[],
        refetchRanchers: jest.fn(),
      });

      const title = screen.queryByText('title');

      expect(title).toBeNull();
    });
  });
});
