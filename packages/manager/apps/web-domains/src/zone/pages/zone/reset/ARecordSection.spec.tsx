import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import ARecordSection from '@/zone/pages/zone/reset/ARecordSection';
import type { AType } from '@/zone/pages/zone/reset/reset.types';

describe('ARecordSection', () => {
    const defaultProps = {
        aType: null as AType | null,
        aHosting: '',
        aCustomIp: '',
        ipError: '',
        hostings: ['hosting1.example.com', 'hosting2.example.com'],
        isLoadingHostings: false,
        onATypeChange: vi.fn(),
        onHostingChange: vi.fn(),
        onIpChange: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the A record type select', () => {
        render(<ARecordSection {...defaultProps} />, { wrapper });
        expect(screen.getByText('zone_page_reset_type_a_label')).toBeInTheDocument();
    });

    it('does not show hosting select when aType is null', () => {
        render(<ARecordSection {...defaultProps} />, { wrapper });
        expect(
            screen.queryByText('zone_page_reset_type_hosting_web_label'),
        ).not.toBeInTheDocument();
    });

    it('does not show custom IP input when aType is null', () => {
        render(<ARecordSection {...defaultProps} />, { wrapper });
        expect(
            screen.queryByText('zone_page_reset_type_custom_a_label'),
        ).not.toBeInTheDocument();
    });

    it('shows hosting select when aType is HOSTING_WEB', () => {
        render(
            <ARecordSection {...defaultProps} aType="HOSTING_WEB" />,
            { wrapper },
        );
        expect(
            screen.getByText('zone_page_reset_type_hosting_web_label'),
        ).toBeInTheDocument();
    });

    it('shows loading spinner in hosting select when isLoadingHostings is true', () => {
        render(
            <ARecordSection
                {...defaultProps}
                aType="HOSTING_WEB"
                isLoadingHostings={true}
            />,
            { wrapper },
        );
        // Spinner should be rendered
        expect(
            screen.queryByText('zone_page_reset_type_hosting_web_label'),
        ).toBeInTheDocument();
    });

    it('shows custom IP input when aType is CUSTOM', () => {
        render(
            <ARecordSection {...defaultProps} aType="CUSTOM" />,
            { wrapper },
        );
        expect(
            screen.getByText('zone_page_reset_type_custom_a_label'),
        ).toBeInTheDocument();
    });

    it('shows IP error message when ipError is set', () => {
        render(
            <ARecordSection
                {...defaultProps}
                aType="CUSTOM"
                ipError="zone_page_form_target_ipv4_valid"
            />,
            { wrapper },
        );
        expect(
            screen.getByText('zone_page_form_target_ipv4_valid'),
        ).toBeInTheDocument();
    });
});
