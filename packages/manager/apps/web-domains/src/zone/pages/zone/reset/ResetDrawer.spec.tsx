import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams } from 'react-router-dom';
import ResetDrawer from '@/zone/pages/zone/reset/ResetDrawer';

const resetZoneMock = vi.fn();
const addSuccessMock = vi.fn();
const addErrorMock = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', () => ({
    useGetHostings: vi.fn(),
    useGetHostingDetails: vi.fn(),
    useGetEmailDomain: vi.fn(),
    useGetEmailRecommendedDNS: vi.fn(),
    useResetZone: vi.fn(),
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
    };
});

describe('ResetDrawer', () => {
    const onCloseCallback = vi.fn();
    const onSuccessCallback = vi.fn();

    beforeEach(async () => {
        vi.clearAllMocks();
        (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
            serviceName: 'example.com',
        });

        const {
            useGetHostings,
            useGetHostingDetails,
            useGetEmailDomain,
            useGetEmailRecommendedDNS,
            useResetZone,
        } = await import('@/zone/hooks/data/history.hooks');

        (useGetHostings as ReturnType<typeof vi.fn>).mockReturnValue({
            hostings: ['myhosting.example.com'],
            isLoadingHostings: false,
        });
        (useGetHostingDetails as ReturnType<typeof vi.fn>).mockReturnValue({
            hostingDetails: { hostingIp: '1.2.3.4' },
            isLoadingHostingDetails: false,
        });
        (useGetEmailDomain as ReturnType<typeof vi.fn>).mockReturnValue({
            emailDomain: { offer: 'STANDARD' },
            emailDomainError: null,
        });
        (useGetEmailRecommendedDNS as ReturnType<typeof vi.fn>).mockReturnValue({
            emailRecommendedDNS: [],
            isLoadingEmailDNS: false,
        });
        (useResetZone as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: resetZoneMock,
            isPending: false,
        });
    });

    it('renders the reset drawer with title', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(screen.getByText('zone_page_reset_title')).toBeInTheDocument();
    });

    it('renders the warning message', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(screen.getByText('zone_page_reset_warning')).toBeInTheDocument();
    });

    it('renders the propagation info message', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(
            screen.getByText('zone_page_reset_propagation_info'),
        ).toBeInTheDocument();
    });

    it('renders minimized question', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(
            screen.getByText('zone_page_reset_minimized_question'),
        ).toBeInTheDocument();
    });

    it('renders the A record type select', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(screen.getByText('zone_page_reset_type_a_label')).toBeInTheDocument();
    });

    it('renders the MX record type select', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(
            screen.getByText('zone_page_reset_type_mx_label'),
        ).toBeInTheDocument();
    });

    it('disables confirm button when form is not valid', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const confirmBtn = screen.getByRole('button', {
            name: /zone_page_reset_confirm/i,
        });
        expect(confirmBtn).toBeDisabled();
    });

    it('calls onCloseCallback when cancel button is clicked', () => {
        render(
            <ResetDrawer
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_reset_cancel/i }),
        );
        expect(onCloseCallback).toHaveBeenCalledTimes(1);
    });
});
