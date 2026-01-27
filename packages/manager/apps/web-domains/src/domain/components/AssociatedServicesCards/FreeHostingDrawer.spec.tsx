import '@/common/setupTests';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  wrapper,
} from '@/common/utils/test.provider';
import FreeHostingDrawer from './FreeHostingDrawer';
import { FreeHostingOptions } from './Hosting';
import { TInitialOrderFreeHosting } from '@/domain/types/hosting';

interface MockPriceCardProps {
  title?: string;
  checked?: boolean;
  disabled?: boolean;
  footer?: React.ReactNode;
}

vi.mock('../Card/PriceCard', () => ({
  default: ({ title, checked, disabled, footer }: MockPriceCardProps) => (
    <div data-testid="price-card">
      <div data-testid="price-card-title">{title}</div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        readOnly
        data-testid="price-card-checkbox"
      />
      {footer && <div data-testid="price-card-footer">{footer}</div>}
    </div>
  ),
}));

describe('FreeHostingDrawer Component', () => {
  const mockOrderFreeHosting = vi.fn();
  const mockOnClose = vi.fn();
  const mockSetFreeHostingOptions = vi.fn();

  const defaultProps = {
    isDrawerOpen: true,
    freeHostingOptions: {
      dnsA: false,
      dnsMx: false,
      consent: false,
    } as FreeHostingOptions,
    isInitialOrderFreeHostingPending: false,
    isOrderFreeHostingPending: false,
    orderCartDetails: {
      cartId: 'cart123',
      details: [{ cartItemID: 456 }],
      contracts: [
        {
          name: 'Terms and Conditions',
          url: 'https://example.com/terms',
          content: '',
        },
        {
          name: 'Privacy Policy',
          url: 'https://example.com/privacy',
          content: '',
        },
      ],
    } as TInitialOrderFreeHosting,
    setFreeHostingOptions: mockSetFreeHostingOptions,
    onClose: mockOnClose,
    orderFreeHosting: mockOrderFreeHosting,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(<FreeHostingDrawer {...defaultProps} {...props} />, {
      wrapper,
    });
  };

  describe('Drawer rendering', () => {
    it('should render drawer when isDrawerOpen is true', () => {
      renderComponent();
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    });

    it('should not render drawer when isDrawerOpen is false', () => {
      renderComponent({ isDrawerOpen: false });
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });

    it('should call onClose when drawer is closed', async () => {
      renderComponent();
      const closeButton = screen.getByTestId('drawer-close-trigger');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Loading state', () => {
    it('should display loading spinner when isOrderFreeHostingPending is true', () => {
      renderComponent({ isOrderFreeHostingPending: true });

      const spinners = screen.getAllByTestId('spinner');
      expect(spinners.length).toBeGreaterThan(0);
      expect(
        screen.getByText(
          'domain_tab_general_information_associated_services_hosting_order_loading',
        ),
      ).toBeInTheDocument();
    });

    it('should display spinner in activation section when isInitialOrderFreeHostingPending is true', () => {
      renderComponent({ isInitialOrderFreeHostingPending: true });

      expect(screen.getAllByTestId('spinner').length).toBeGreaterThan(0);
    });
  });

  describe('Content sections', () => {
    it('should display the drawer title', () => {
      renderComponent();
      expect(
        screen.getByText(
          'domain_tab_general_information_associated_services_hosting_drawer_title',
        ),
      ).toBeInTheDocument();
    });

    it('should display the offer section with PriceCard', () => {
      renderComponent();
      expect(screen.getByTestId('price-card')).toBeInTheDocument();
      expect(screen.getByTestId('price-card-title')).toHaveTextContent(
        'domain_tab_general_information_associated_services_hosting_drawer_offer_title',
      );
    });

    it('should display DNS section with checkboxes', () => {
      renderComponent();
      expect(
        screen.getByText(
          'domain_tab_general_information_associated_services_hosting_drawer_offer_dns_content',
        ),
      ).toBeInTheDocument();

      const checkboxes = screen.getAllByTestId('checkbox-input');
      // DNS A, DNS MX, Tarification (disabled), and Consent checkboxes
      expect(checkboxes.length).toBeGreaterThanOrEqual(4);
    });

    it('should display tarification section', () => {
      renderComponent();
      expect(
        screen.getByText(
          'domain_tab_general_information_associated_services_hosting_drawer_offer_tarification_content',
        ),
      ).toBeInTheDocument();
    });

    it('should display activation section with consent checkbox', () => {
      renderComponent();
      expect(
        screen.getByText(
          'domain_tab_general_information_associated_services_hosting_drawer_offer_activation_content',
        ),
      ).toBeInTheDocument();
    });

    it('should display contract links', () => {
      renderComponent();
      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(2);
      expect(links[0]).toHaveAttribute('href', 'https://example.com/terms');
      expect(links[0]).toHaveTextContent('Terms and Conditions');
      expect(links[1]).toHaveAttribute('href', 'https://example.com/privacy');
      expect(links[1]).toHaveTextContent('Privacy Policy');
    });
  });

  describe('Checkbox interactions', () => {
    it('should update dnsA option when DNS A checkbox is changed', async () => {
      renderComponent();

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const dnsACheckbox = checkboxes[0]; // First checkbox should be DNS A

      fireEvent.click(dnsACheckbox);

      await waitFor(() => {
        expect(mockSetFreeHostingOptions).toHaveBeenCalled();
      });
    });

    it('should update dnsMx option when DNS MX checkbox is changed', async () => {
      renderComponent();

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const dnsMxCheckbox = checkboxes[1];

      fireEvent.click(dnsMxCheckbox);

      await waitFor(() => {
        expect(mockSetFreeHostingOptions).toHaveBeenCalled();
      });
    });

    it('should update consent option when consent checkbox is changed', async () => {
      renderComponent();

      const checkboxes = screen.getAllByTestId('checkbox-input');
      const consentCheckbox = checkboxes.find((cb) => {
        const input = cb as HTMLInputElement;
        return !input.disabled && cb !== checkboxes[0] && cb !== checkboxes[1];
      });

      if (consentCheckbox) {
        fireEvent.click(consentCheckbox);

        await waitFor(() => {
          expect(mockSetFreeHostingOptions).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Footer buttons', () => {
    it('should display cancel and validate buttons', async () => {
      renderComponent();
      await waitFor(() => {
        expect(
          screen.getByText(
            '@ovh-ux/manager-common-translations/actions:cancel',
          ),
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.getByText(
            '@ovh-ux/manager-common-translations/actions:validate',
          ),
        ).toBeInTheDocument();
      });
    });

    it('should call onClose when cancel button is clicked', async () => {
      renderComponent();
      const cancelButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:cancel',
      );
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should disable validate button when consent is not checked', () => {
      renderComponent({
        freeHostingOptions: {
          dnsA: true,
          dnsMx: true,
          consent: false,
        },
      });

      const validateButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:validate',
      );
      expect(validateButton).toBeDisabled();
    });

    it('should enable validate button when consent is checked', () => {
      renderComponent({
        freeHostingOptions: {
          dnsA: false,
          dnsMx: false,
          consent: true,
        },
      });

      const validateButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:validate',
      );
      expect(validateButton).not.toBeDisabled();
    });

    it('should call orderFreeHosting with correct parameters when validate is clicked', async () => {
      const options = {
        dnsA: true,
        dnsMx: true,
        consent: true,
      };

      renderComponent({
        freeHostingOptions: options,
      });

      const validateButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:validate',
      );
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockOrderFreeHosting).toHaveBeenCalledWith({
          cartId: 'cart123',
          itemId: 456,
          options,
        });
      });
    });
  });

  describe('Props updates', () => {
    it('should reflect updated freeHostingOptions', () => {
      const { rerender } = renderComponent();

      const updatedOptions = {
        dnsA: true,
        dnsMx: true,
        consent: true,
      };

      rerender(
        <FreeHostingDrawer
          {...defaultProps}
          freeHostingOptions={updatedOptions}
        />,
      );

      const validateButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:validate',
      );
      expect(validateButton).not.toBeDisabled();
    });

    it('should handle empty contracts array', () => {
      renderComponent({
        orderCartDetails: {
          ...defaultProps.orderCartDetails,
          contracts: [],
        },
      });

      const links = screen.queryAllByTestId('link');
      expect(links.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing orderCartDetails gracefully', () => {
      renderComponent({
        orderCartDetails: undefined,
      });

      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    it('should not crash when orderCartDetails.details is empty', () => {
      renderComponent({
        orderCartDetails: {
          ...defaultProps.orderCartDetails,
          details: [],
        },
      });

      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });
  });
});
