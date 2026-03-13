import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import {
    CreationDateCell,
    SelectRowCell,
    ViewZoneCell,
    DownloadZoneCell,
} from '@/zone/components/HistoryCells';
import type { TZoneHistoryWithDate } from '@/zone/types/history.types';

const mockDownload = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', async (importOriginal) => {
    const actual = await importOriginal<
        typeof import('@/zone/hooks/data/history.hooks')
    >();
    return {
        ...actual,
        useDownloadZoneFile: vi.fn(() => ({
            mutate: mockDownload,
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
    };
});

const mockRow: TZoneHistoryWithDate = {
    id: 'history-1',
    date: '2024-01-15T10:00:00Z',
    creationDate: '2024-01-15T10:00:00Z',
    zoneFileUrl: 'https://api.example.com/zone/file/1',
};

describe('CreationDateCell', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the creation date', () => {
        render(<CreationDateCell row={mockRow} />, { wrapper });
        expect(screen.getByText(mockRow.creationDate)).toBeInTheDocument();
    });

    it('renders active badge when isActive is true', () => {
        render(<CreationDateCell row={mockRow} isActive={true} />, { wrapper });
        expect(screen.getByText('zone_history_current')).toBeInTheDocument();
    });

    it('does not render active badge when isActive is false', () => {
        render(<CreationDateCell row={mockRow} isActive={false} />, { wrapper });
        expect(
            screen.queryByText('zone_history_current'),
        ).not.toBeInTheDocument();
    });

    it('does not render active badge by default', () => {
        render(<CreationDateCell row={mockRow} />, { wrapper });
        expect(
            screen.queryByText('zone_history_current'),
        ).not.toBeInTheDocument();
    });
});

describe('SelectRowCell', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders a checkbox', () => {
        render(
            <SelectRowCell
                row={mockRow}
                isSelected={false}
                onSelectChange={vi.fn()}
            />,
            { wrapper },
        );
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders checkbox as checked when isSelected is true', () => {
        render(
            <SelectRowCell
                row={mockRow}
                isSelected={true}
                onSelectChange={vi.fn()}
            />,
            { wrapper },
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('renders checkbox as unchecked when isSelected is false', () => {
        render(
            <SelectRowCell
                row={mockRow}
                isSelected={false}
                onSelectChange={vi.fn()}
            />,
            { wrapper },
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });
});

describe('ViewZoneCell', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the view button with label', () => {
        render(
            <ViewZoneCell row={mockRow} onView={vi.fn()} />,
            { wrapper },
        );
        expect(screen.getByText('zone_history_view')).toBeInTheDocument();
    });

    it('calls onView with the row when clicked', () => {
        const onView = vi.fn();
        render(<ViewZoneCell row={mockRow} onView={onView} />, { wrapper });
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onView).toHaveBeenCalledWith(mockRow);
    });
});

describe('DownloadZoneCell', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the download button with label', () => {
        render(
            <DownloadZoneCell row={mockRow} zoneName="example.com" />,
            { wrapper },
        );
        expect(screen.getByText('zone_history_download')).toBeInTheDocument();
    });

    it('calls download mutate when clicked', () => {
        render(
            <DownloadZoneCell row={mockRow} zoneName="example.com" />,
            { wrapper },
        );
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockDownload).toHaveBeenCalledWith({
            url: mockRow.zoneFileUrl,
            zoneName: 'example.com',
        });
    });

    it('disables the button when isPending is true', async () => {
        const { useDownloadZoneFile } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useDownloadZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockDownload,
            isPending: true,
        });
        render(
            <DownloadZoneCell row={mockRow} zoneName="example.com" />,
            { wrapper },
        );
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
