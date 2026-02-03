import '@/common/setupTests';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import TransferModal from './TransferModal';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';

describe('TransferModal component', () => {
  const mockUpdateDomain = vi.fn();
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Deactivation modal (PROTECTED -> UNPROTECTED)', () => {
    it('renders deactivation modal with correct content', () => {
      render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.PROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_deactivate_modal',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_content_deactivate_modal',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_content_deactivate_modal_info',
        ),
      ).toBeInTheDocument();
    });

    it('calls updateDomain when confirm button is clicked', () => {
      render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.PROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find((btn) =>
        btn.className.includes('critical'),
      );
      fireEvent.click(confirmButton);

      expect(mockUpdateDomain).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', () => {
      render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.PROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const buttons = screen.getAllByRole('button');
      const cancelButton = buttons.find((btn) =>
        btn.className.includes('ghost'),
      );
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Activation modal (UNPROTECTED -> PROTECTED)', () => {
    it('renders activation modal with correct content', () => {
      render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.UNPROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_activation_modal',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_content_activation_modal',
        ),
      ).toBeInTheDocument();
    });

    it('calls updateDomain when confirm button is clicked', () => {
      render(
        <TransferModal
          serviceName="test-domain.fr"
          currentProtectionState={ProtectionStateEnum.UNPROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find((btn) =>
        btn.className.includes('information'),
      );
      fireEvent.click(confirmButton);

      expect(mockUpdateDomain).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', () => {
      render(
        <TransferModal
          serviceName="test-domain.fr"
          currentProtectionState={ProtectionStateEnum.UNPROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      const buttons = screen.getAllByRole('button');
      const cancelButton = buttons.find((btn) =>
        btn.className.includes('ghost'),
      );
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Modal visibility', () => {
    it('renders when open is true', () => {
      render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.PROTECTED}
          open={true}
          updateDomain={mockUpdateDomain}
          onClose={mockOnClose}
        />,
        { wrapper },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_deactivate_modal',
        ),
      ).toBeInTheDocument();
    });

    it('does not render modal content when open is false', () => {
      const { container } = render(
        <TransferModal
          serviceName="example.com"
          currentProtectionState={ProtectionStateEnum.PROTECTED}
          open={false}
          updateDomain={mockUpdateDomain}
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
