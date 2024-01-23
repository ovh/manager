import React from 'react';
import Listing, { ListingProps } from './index';
import { render, waitFor } from '../../utils/test.provider';
import { RancherService } from '@/api/api.type';
import listingTranslation from '@/public/translations/pci-rancher/listing/Messages_fr_FR.json';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ isLoading: false, data: [] })),
  useMutation: jest.fn(() => ({ isLoading: false, data: [] })),
}));

const setupSpecTest = async (props?: ListingProps) =>
  waitFor(() => render(<Listing {...props} />));

describe('Listing Page', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest({
      data: [
        { id: '123', currentState: { name: 'Rancher1' } } as RancherService,
      ],
    });

    const title = screen.getByText(listingTranslation.rancherTitle);

    expect(title).not.toBeNull();
  });

  describe("Given that I'm a Public Cloud user without any Rancher service", () => {
    it('Should display the onboarding page', async () => {
      const screen = await setupSpecTest({
        data: [] as RancherService[],
      });

      // TODO: test way to check if onboarding title is displayed
      const title = screen.queryByText('title');

      expect(title).toBeNull();
    });
  });
});
