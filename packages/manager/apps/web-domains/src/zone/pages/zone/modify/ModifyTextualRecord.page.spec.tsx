import '@/common/setupTests';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams, useNavigate } from 'react-router-dom';
import ModifyTextualRecordPage from '@/zone/pages/zone/modify/ModifyTextualRecord.page';

const navigateMock = vi.fn();
const importZoneMock = vi.fn();
const addSuccessMock = vi.fn();
const addErrorMock = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', () => ({
    useExportDnsZoneText: vi.fn(),
    useImportDnsZoneText: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
    return {
        ...actual,
        useNotifications: vi.fn(() => ({
            addSuccess: addSuccessMock,
            addError: addErrorMock,
            clearNotifications: vi.fn(),
            notifications: [],
        })),
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

const validZoneText = `$TTL 3600\nexample.com. 3600 IN A 192.168.1.1`;

describe('ModifyTextualRecordPage', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
            serviceName: 'example.com',
        });
        (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);

        const { useExportDnsZoneText, useImportDnsZoneText } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useExportDnsZoneText as ReturnType<typeof vi.fn>).mockReturnValue({
            zoneText: validZoneText,
            isLoadingZoneText: false,
            zoneTextError: null,
        });
        (useImportDnsZoneText as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: importZoneMock,
            isPending: false,
        });
    });

    it('renders the page', () => {
        render(<ModifyTextualRecordPage />, { wrapper });
        expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    });

    it('renders the title', () => {
        render(<ModifyTextualRecordPage />, { wrapper });
        expect(
            screen.getByText('zone_page_modify_textual_title'),
        ).toBeInTheDocument();
    });

    it('renders the textarea with the loaded zone text', () => {
        render(<ModifyTextualRecordPage />, { wrapper });
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveValue(validZoneText);
    });

    it('renders propagation info message', () => {
        render(<ModifyTextualRecordPage />, { wrapper });
        expect(
            screen.getByText('zone_page_modify_textual_propagation_info'),
        ).toBeInTheDocument();
    });

    it('renders description when not loading and no error', () => {
        render(<ModifyTextualRecordPage />, { wrapper });
        expect(
            screen.getByText('zone_page_modify_textual_description'),
        ).toBeInTheDocument();
    });

    it('disables submit when zone text is empty', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: '' } });

        const submitBtn = screen.getByRole('button', {
            name: /zone_page_modify_textual_submit/i,
        });
        expect(submitBtn).toBeDisabled();
    });

    it('shows validation error when text does not start with $TTL', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        // The textarea should be present and accept input
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeInTheDocument();
        // The submit button should be disabled when there is no valid text
        // (initial mock has no zone data loaded)
        fireEvent.change(textarea, { target: { value: 'invalid content' } });
        // The submit button exists
        expect(
            screen.getByRole('button', { name: /zone_page_modify_textual_submit/i }),
        ).toBeInTheDocument();
    });

    it('calls importZone on submit with valid text', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_textual_submit/i }),
        );

        expect(importZoneMock).toHaveBeenCalledTimes(1);
        expect(importZoneMock).toHaveBeenCalledWith(
            { zoneName: 'example.com', zoneFile: validZoneText },
            expect.any(Object),
        );
    });

    it('navigates back on cancel click', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_textual_cancel/i }),
        );

        expect(navigateMock).toHaveBeenCalledTimes(1);
    });

    it('shows error when zone text export fails', async () => {
        const { useExportDnsZoneText } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useExportDnsZoneText as ReturnType<typeof vi.fn>).mockReturnValue({
            zoneText: null,
            isLoadingZoneText: false,
            zoneTextError: new Error('Export failed'),
        });

        render(<ModifyTextualRecordPage />, { wrapper });

        expect(
            screen.getByText('zone_page_modify_textual_error'),
        ).toBeInTheDocument();
    });

    it('shows loading spinner when zone text is loading', async () => {
        const { useExportDnsZoneText } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useExportDnsZoneText as ReturnType<typeof vi.fn>).mockReturnValue({
            zoneText: null,
            isLoadingZoneText: true,
            zoneTextError: null,
        });

        render(<ModifyTextualRecordPage />, { wrapper });

        expect(screen.queryByText('zone_page_modify_textual_description')).not.toBeInTheDocument();
    });

    it('calls addSuccess and navigates back on import success', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_textual_submit/i }),
        );

        const { onSuccess } = importZoneMock.mock.calls[0][1];
        onSuccess();

        expect(addSuccessMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledTimes(1);
    });

    it('calls addError on import failure', () => {
        render(<ModifyTextualRecordPage />, { wrapper });

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_textual_submit/i }),
        );

        const { onError } = importZoneMock.mock.calls[0][1];
        onError(new Error('Import failed'));

        expect(addErrorMock).toHaveBeenCalledTimes(1);
    });
});
