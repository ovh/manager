import '@/common/setupTests';
import { vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  wrapper,
} from '@/common/utils/test.provider';
import DnssecModal from './DnssecModal';

describe('DnssecModal component', () => {
  const mockUpdateDnssec = vi.fn();
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Activation modal (DISABLED -> ENABLED)', () => {
    it('renders activation modal with correct content', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_activation_modal',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_content_activation_modal',
        ),
      ).toBeInTheDocument();
    });

    it('displays action message for activation', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_content_action',
        ),
      ).toBeInTheDocument();
    });

    it('calls updateDnssec when confirm button is clicked', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const confirmButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:confirm',
      );
      fireEvent.click(confirmButton);

      expect(mockUpdateDnssec).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const cancelButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:cancel',
      );
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Deactivation modal (ENABLED -> DISABLED)', () => {
    it('renders deactivation modal with correct content', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={false}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_deactivate_modal',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_content_deactivate_modal',
        ),
      ).toBeInTheDocument();
    });

    it('displays action message for deactivation', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={false}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_content_action',
        ),
      ).toBeInTheDocument();
    });

    it('calls updateDnssec when confirm button is clicked', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={false}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const confirmButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:confirm',
      );
      fireEvent.click(confirmButton);

      expect(mockUpdateDnssec).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={false}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const cancelButton = screen.getByText(
        '@ovh-ux/manager-common-translations/actions:cancel',
      );
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal visibility', () => {
    it('renders when open is true', () => {
      render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={true}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_activation_modal',
        ),
      ).toBeInTheDocument();
    });

    it('does not render modal content when open is false', () => {
      const { container } = render(
        <DnssecModal
          isEnableDnssecAction={true}
          open={false}
          updateDnssec={mockUpdateDnssec}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        container.querySelector('[role="dialog"]'),
      ).not.toBeInTheDocument();
    });
  });
});
