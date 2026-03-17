import '@/common/setupTests';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CompareZonesPage from '@/zone/pages/zone/compare/CompareZones.page';

const navigateMock = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', () => ({
    useGetZoneHistoryWithDetails: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
    return {
        ...actual,
        useFormatDate: vi.fn(() => ({ date, format }: { date: string; format: string }) => date),
        Notifications: () => <div data-testid="notifications" />,
        BaseLayout: ({
            children,
        }: {
            children: React.ReactNode;
            [key: string]: unknown;
        }) => <div data-testid="base-layout">{children}</div>,
        Breadcrumb: () => <div data-testid="breadcrumb" />,
    };
});

vi.mock('@/zone/components/CompareZonesViewer', () => ({
    default: ({
        baseItem,
        modifiedItem,
    }: {
        baseItem: { id: string };
        modifiedItem: { id: string };
    }) => (
        <div data-testid="compare-zones-viewer">
            <span data-testid="base-id">{baseItem.id}</span>
            <span data-testid="modified-id">{modifiedItem.id}</span>
        </div>
    ),
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
    {
        id: '2025-01-08T10:00:00.000Z',
        date: '2025-01-08T10:00:00.000Z',
        creationDate: '2025-01-08T10:00:00.000Z',
        zoneFileUrl: 'https://example.com/zone3',
    },
];

describe('CompareZonesPage', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
            serviceName: 'example.com',
        });
        (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);
        (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
            pathname: '/zone/example.com/compare',
            search: '',
            state: null,
        });

        const { useGetZoneHistoryWithDetails } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneHistoryWithDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            history: historyItems,
            isLoading: false,
            error: null,
        });
    });

    it('renders the compare zones page', () => {
        render(<CompareZonesPage />, { wrapper });
        expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    });

    it('shows the history description', () => {
        render(<CompareZonesPage />, { wrapper });
        expect(screen.getByText('zone_history_description')).toBeInTheDocument();
    });

    it('renders the base and modified select labels', () => {
        render(<CompareZonesPage />, { wrapper });
        expect(
            screen.getByText('zone_history_compare_base_label'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('zone_history_compare_modified_label'),
        ).toBeInTheDocument();
    });

    it('renders the CompareZonesViewer when two different items are selected', async () => {
        (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
            pathname: '/zone/example.com/compare',
            search: '',
            state: {
                baseId: historyItems[0].id,
                modifiedId: historyItems[1].id,
            },
        });

        render(<CompareZonesPage />, { wrapper });

        expect(screen.getByTestId('compare-zones-viewer')).toBeInTheDocument();
        expect(screen.getByTestId('base-id')).toHaveTextContent(historyItems[0].id);
        expect(screen.getByTestId('modified-id')).toHaveTextContent(
            historyItems[1].id,
        );
    });

    it('shows empty state when no items are selected', async () => {
        const { useGetZoneHistoryWithDetails } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneHistoryWithDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            history: [],
            isLoading: false,
            error: null,
        });

        render(<CompareZonesPage />, { wrapper });

        expect(screen.getByText('zone_history_compare_empty')).toBeInTheDocument();
    });
});
