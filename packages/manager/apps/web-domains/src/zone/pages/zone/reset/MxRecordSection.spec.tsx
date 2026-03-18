import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import MxRecordSection from '@/zone/pages/zone/reset/MxRecordSection';
import type { MxEntry, MxType } from '@/zone/pages/zone/reset/reset.types';

describe('MxRecordSection', () => {
    const defaultEntry: MxEntry = { id: '1', target: '', priority: 10 };

    const defaultProps = {
        mxType: null as MxType | null,
        mxEntries: [defaultEntry],
        availableMxTypes: ['EMAILS', 'CUSTOM'] as MxType[],
        onMxTypeChange: vi.fn(),
        onUpdateEntry: vi.fn(),
        onAddEntry: vi.fn(),
        onRemoveEntry: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the MX record type select label', () => {
        render(<MxRecordSection {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_reset_type_mx_label')).toBeInTheDocument();
    });

    it('does not show custom MX section when mxType is not CUSTOM', () => {
        render(<MxRecordSection {...defaultProps} mxType="EMAILS" />, { wrapper });
        expect(
            screen.queryByText('zone_page_reset_type_custom_mx_label'),
        ).not.toBeInTheDocument();
    });

    it('does not show custom MX section when mxType is null', () => {
        render(<MxRecordSection {...defaultProps} />, { wrapper });
        expect(
            screen.queryByText('zone_page_reset_type_custom_mx_label'),
        ).not.toBeInTheDocument();
    });

    it('shows custom MX entries section when mxType is CUSTOM', () => {
        render(
            <MxRecordSection {...defaultProps} mxType="CUSTOM" />,
            { wrapper },
        );
        expect(
            screen.getByText('zone_page_reset_type_custom_mx_label'),
        ).toBeInTheDocument();
    });

    it('shows MX server label for first entry when mxType is CUSTOM', () => {
        render(
            <MxRecordSection {...defaultProps} mxType="CUSTOM" />,
            { wrapper },
        );
        expect(screen.getByText('zone_page_reset_mx_server')).toBeInTheDocument();
    });

    it('shows MX priority label for first entry when mxType is CUSTOM', () => {
        render(
            <MxRecordSection {...defaultProps} mxType="CUSTOM" />,
            { wrapper },
        );
        expect(screen.getByText('zone_page_reset_mx_priority')).toBeInTheDocument();
    });

    it('does not show remove button when only one entry is present', () => {
        render(
            <MxRecordSection {...defaultProps} mxType="CUSTOM" mxEntries={[defaultEntry]} />,
            { wrapper },
        );
        // Remove button appears only when there are multiple entries
        const removeButtons = screen.queryAllByRole('button');
        // The only buttons should be the "+" add button (if target is non-empty)
        // With empty target, no add button either — so no action buttons visible
        expect(removeButtons).toHaveLength(0);
    });

    it('calls onRemoveEntry when remove button is clicked with multiple entries', () => {
        const onRemoveEntry = vi.fn();
        const entries: MxEntry[] = [
            { id: '1', target: 'mail1.example.com', priority: 10 },
            { id: '2', target: 'mail2.example.com', priority: 20 },
        ];
        render(
            <MxRecordSection
                {...defaultProps}
                mxType="CUSTOM"
                mxEntries={entries}
                onRemoveEntry={onRemoveEntry}
            />,
            { wrapper },
        );
        const removeButtons = screen.getAllByRole('button');
        fireEvent.click(removeButtons[0]);
        expect(onRemoveEntry).toHaveBeenCalledWith(0);
    });

    it('shows add "+" button when last entry has non-empty target', () => {
        const entries: MxEntry[] = [
            { id: '1', target: 'mail.example.com', priority: 10 },
        ];
        render(
            <MxRecordSection
                {...defaultProps}
                mxType="CUSTOM"
                mxEntries={entries}
            />,
            { wrapper },
        );
        const addButton = screen.getByRole('button', { name: '+' });
        expect(addButton).toBeInTheDocument();
    });

    it('calls onAddEntry when "+" button is clicked', () => {
        const onAddEntry = vi.fn();
        const entries: MxEntry[] = [
            { id: '1', target: 'mail.example.com', priority: 10 },
        ];
        render(
            <MxRecordSection
                {...defaultProps}
                mxType="CUSTOM"
                mxEntries={entries}
                onAddEntry={onAddEntry}
            />,
            { wrapper },
        );
        const addButton = screen.getByRole('button', { name: '+' });
        fireEvent.click(addButton);
        expect(onAddEntry).toHaveBeenCalledTimes(1);
    });
});
