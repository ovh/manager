import '@/common/setupTests';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { AddEntryResume } from '@/zone/pages/zone/add/components/AddEntryResume.component';
import type { ConflictingRecord } from '@/zone/pages/zone/add/components/AddEntryResume.component';

vi.mock('@ovh-ux/muk', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@ovh-ux/muk')>();
    return {
        ...actual,
        Datagrid: ({ data }: { data: unknown[] }) => (
            <div data-testid="datagrid">{data.length} rows</div>
        ),
    };
});

describe('AddEntryResume', () => {
    const defaultProps = {
        recordType: 'A',
        resumeDomain: 'www.example.com',
        targetValue: '192.168.1.1',
        recordConflicts: true,
        conflictingRecords: [] as ConflictingRecord[],
    };

    it('renders the resume info message', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_resume_info')).toBeInTheDocument();
    });

    it('renders the record type', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders the domain', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('www.example.com')).toBeInTheDocument();
    });

    it('renders the target value', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    });

    it('renders the type label', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_form_type')).toBeInTheDocument();
    });

    it('renders the domain label', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_form_domain')).toBeInTheDocument();
    });

    it('renders the target label', () => {
        render(<AddEntryResume {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_form_target')).toBeInTheDocument();
    });

    it('renders TTL when ttlSelect is custom and ttl is set', () => {
        render(
            <AddEntryResume
                {...defaultProps}
                ttlSelect="custom"
                ttl={3600}
            />,
            { wrapper },
        );
        expect(screen.getByText('zone_page_form_ttl')).toBeInTheDocument();
        expect(screen.getByText('3600')).toBeInTheDocument();
    });

    it('does not render TTL when ttlSelect is global', () => {
        render(
            <AddEntryResume
                {...defaultProps}
                ttlSelect="global"
                ttl={3600}
            />,
            { wrapper },
        );
        expect(
            screen.queryByText('zone_page_form_ttl'),
        ).not.toBeInTheDocument();
    });

    it('renders warning when recordConflicts is false', () => {
        render(
            <AddEntryResume {...defaultProps} recordConflicts={false} />,
            { wrapper },
        );
        expect(
            screen.getByText(/zone_page_resume_check_warning_info/),
        ).toBeInTheDocument();
    });

    it('renders info alert when recordConflicts is true', () => {
        render(
            <AddEntryResume {...defaultProps} recordConflicts={true} />,
            { wrapper },
        );
        expect(screen.getByText('zone_page_resume_alert')).toBeInTheDocument();
    });

    it('renders conflicting records datagrid for CNAME type with conflicts', () => {
        const conflicts: ConflictingRecord[] = [
            {
                domainToDisplay: 'www.example.com',
                fieldType: 'A',
                targetToDisplay: '1.2.3.4',
            },
        ];
        render(
            <AddEntryResume
                {...defaultProps}
                recordType="CNAME"
                hasSubDomain={true}
                recordConflicts={false}
                conflictingRecords={conflicts}
            />,
            { wrapper },
        );
        expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });

    it('displays TXT type for SPF record type', () => {
        render(
            <AddEntryResume {...defaultProps} recordType="SPF" />,
            { wrapper },
        );
        // SPF is in RECORD_TYPES_AS_TXT — should display as TXT
        expect(screen.getByText('TXT')).toBeInTheDocument();
    });
});
