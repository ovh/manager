import '@/common/setupTests';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams, useNavigate } from 'react-router-dom';
import HistoryPage from '@/zone/pages/zone/history/History.page';

const navigateMock = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', () => ({
    useGetZoneHistoryWithDetails: vi.fn(),
}));

vi.mock('@/common/hooks/iam/useGetIAMResource', () => ({
    useGetIAMResource: vi.fn(() => ({ data: [{ urn: 'urn:test:dnsZone:example.com' }] })),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
    return {
        ...actual,
        useAuthorizationIam: vi.fn(() => ({ isPending: false, isAuthorized: true })),
        useNotifications: vi.fn(() => ({
            notifications: [],
            clearNotifications: vi.fn(),
            addSuccess: vi.fn(),
            addError: vi.fn(),
        })),
        Notifications: () => <div data-testid="notifications" />,
        BaseLayout: ({ children, ...props }: { children: React.ReactNode;[key: string]: unknown }) => (
            <div data-testid="base-layout">{children}</div>
        ),
        Breadcrumb: () => <div data-testid="breadcrumb" />,
        Datagrid: ({
            items,
            isLoading,
        }: {
            items: unknown[];
            columns: unknown[];
            totalItems: number;
            isLoading: boolean;
            hasNextPage: boolean;
        }) => (
            <div data-testid="datagrid">
                {isLoading && <span data-testid="datagrid-loading" />}
                {(items as { id: string }[]).map((item) => (
                    <div key={item.id} data-testid="history-row" />
                ))}
            </div>
        ),
    };
});

vi.mock('@/zone/components/RestoreZoneModal', () => ({
    default: ({
        isOpen,
        onClose,
    }: {
        isOpen: boolean;
        onClose: () => void;
        item: unknown;
        zoneName: string;
    }) =>
        isOpen ? (
            <div data-testid="restore-modal">
                <button onClick={onClose} data-testid="close-restore-modal">
                    Close
                </button>
            </div>
        ) : null,
}));

vi.mock('@/zone/components/ViewZoneModal', () => ({
    default: ({
        isOpen,
        onClose,
    }: {
        isOpen: boolean;
        onClose: () => void;
        item: unknown;
    }) =>
        isOpen ? (
            <div data-testid="view-modal">
                <button onClick={onClose} data-testid="close-view-modal">
                    Close
                </button>
            </div>
        ) : null,
}));

vi.mock('@/zone/hooks/useHistoryColumns', () => ({
    useHistoryColumns: vi.fn(() => [
        { id: 'creationDate', header: 'Date' },
        { id: 'actions', header: 'Actions' },
    ]),
}));

const historyItems = [
    {
        id: '2025-01-10T10:00:00.000Z',
        date: '2025-01-10T10:00:00.000Z',
        creationDate: '2025-01-10T10:00:00.000Z',
        zoneFileUrl: 'https://example.com/zone1',
    },
    {
        id: '2025-01-09T10:00:00.000Z',
        date: '2025-01-09T10:00:00.000Z',
        creationDate: '2025-01-09T10:00:00.000Z',
        zoneFileUrl: 'https://example.com/zone2',
    },
];

describe('HistoryPage', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
            serviceName: 'example.com',
        });
        (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);

        const { useGetZoneHistoryWithDetails } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneHistoryWithDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            history: historyItems,
            isLoading: false,
            error: null,
        });
    });

    it('renders the history page', () => {
        render(<HistoryPage />, { wrapper });
        expect(screen.getByTestId('base-layout')).toBeInTheDocument();
        expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });

    it('renders rows for each history item', () => {
        render(<HistoryPage />, { wrapper });
        const rows = screen.getAllByTestId('history-row');
        expect(rows).toHaveLength(historyItems.length);
    });

    it('renders loading state when isLoading is true', async () => {
        const { useGetZoneHistoryWithDetails } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneHistoryWithDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            history: [],
            isLoading: true,
            error: null,
        });

        render(<HistoryPage />, { wrapper });
        expect(screen.getByTestId('datagrid-loading')).toBeInTheDocument();
    });

    it('renders the compare versions button', () => {
        render(<HistoryPage />, { wrapper });
        expect(
            screen.getByText('zone_history_compare_versions'),
        ).toBeInTheDocument();
    });

    it('enables compare button when there are at least 2 history items', () => {
        render(<HistoryPage />, { wrapper });
        const btn = screen.getByText('zone_history_compare_versions').closest('button');
        expect(btn).not.toBeDisabled();
    });

    it('disables compare button when fewer than 2 items', async () => {
        const { useGetZoneHistoryWithDetails } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneHistoryWithDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            history: [historyItems[0]],
            isLoading: false,
            error: null,
        });

        render(<HistoryPage />, { wrapper });
        const btn = screen.getByText('zone_history_compare_versions').closest('button');
        expect(btn).toBeDisabled();
    });

    it('navigates to compare page on compare button click', async () => {
        render(<HistoryPage />, { wrapper });
        fireEvent.click(screen.getByText('zone_history_compare_versions'));
        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledTimes(1);
        });
    });

    it('displays the zone history description', () => {
        render(<HistoryPage />, { wrapper });
        expect(screen.getByText('zone_history_description')).toBeInTheDocument();
    });
});
