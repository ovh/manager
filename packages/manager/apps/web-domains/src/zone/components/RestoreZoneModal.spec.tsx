import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import RestoreZoneModal from '@/zone/components/RestoreZoneModal';
import type { TZoneHistoryWithDate } from '@/zone/types/history.types';

const mockRestore = vi.fn();
const mockAddSuccess = vi.fn();
const mockAddError = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', async (importOriginal) => {
    const actual = await importOriginal<
        typeof import('@/zone/hooks/data/history.hooks')
    >();
    return {
        ...actual,
        useRestoreZone: vi.fn(() => ({
            mutate: mockRestore,
            isPending: false,
        })),
    };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual = await importOriginal<
        typeof import('@ovh-ux/manager-react-components')
    >();
    return {
        ...actual,
        useFormatDate: vi.fn(() => ({ date }: { date: string }) => date),
        useNotifications: vi.fn(() => ({
            addSuccess: mockAddSuccess,
            addError: mockAddError,
            addWarning: vi.fn(),
            clearNotifications: vi.fn(),
            notifications: [],
        })),
    };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
    const actual = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
    >();
    return {
        ...actual,
        useNavigationGetUrl: vi.fn(() => ({
            data: 'https://www.ovhcloud.com/manager/#/web-ongoing-operations/dns',
        })),
    };
});

describe('RestoreZoneModal', () => {
    const mockItem: TZoneHistoryWithDate = {
        id: 'zone-history-1',
        date: '2024-01-15T10:00:00Z',
        creationDate: '2024-01-15T10:00:00Z',
        zoneFileUrl: 'https://api.example.com/zone/file/1',
    };

    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        item: mockItem,
        zoneName: 'example.com',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when isOpen is false', () => {
        const { container } = render(
            <RestoreZoneModal {...defaultProps} isOpen={false} />,
            { wrapper },
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when item is null', () => {
        const { container } = render(
            <RestoreZoneModal {...defaultProps} item={null} />,
            { wrapper },
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders modal title when open', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        expect(
            screen.getByText('zone_history_restore_modal_title'),
        ).toBeInTheDocument();
    });

    it('renders warning message about restore date', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        expect(
            screen.getByText(/zone_history_restore_modal_description/),
        ).toBeInTheDocument();
    });

    it('renders propagation info message', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        expect(
            screen.getByText('zone_history_restore_modal_propagation_info'),
        ).toBeInTheDocument();
    });

    it('renders cancel button', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        expect(
            screen.getByText('zone_history_restore_modal_cancel'),
        ).toBeInTheDocument();
    });

    it('renders confirm button', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        expect(
            screen.getByText('zone_history_restore_modal_confirm'),
        ).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        const onClose = vi.fn();
        render(<RestoreZoneModal {...defaultProps} onClose={onClose} />, { wrapper });
        const cancelBtn = screen.getByText('zone_history_restore_modal_cancel');
        fireEvent.click(cancelBtn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls restore mutate when confirm button is clicked', () => {
        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        const confirmBtn = screen.getByText('zone_history_restore_modal_confirm');
        fireEvent.click(confirmBtn);
        expect(mockRestore).toHaveBeenCalledWith(
            { zoneName: 'example.com', creationDate: mockItem.creationDate },
            expect.any(Object),
        );
    });

    it('disables buttons when isPending is true', async () => {
        const { useRestoreZone } = await import('@/zone/hooks/data/history.hooks');
        (useRestoreZone as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockRestore,
            isPending: true,
        });

        render(<RestoreZoneModal {...defaultProps} />, { wrapper });
        const cancelBtn = screen.getByText('zone_history_restore_modal_cancel');
        const confirmBtn = screen.getByText('zone_history_restore_modal_confirm');
        expect(cancelBtn.closest('button')).toBeDisabled();
        expect(confirmBtn.closest('button')).toBeDisabled();
    });
});
