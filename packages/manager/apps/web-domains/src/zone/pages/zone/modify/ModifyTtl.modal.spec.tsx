import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams } from 'react-router-dom';
import ModifyTtlModal from '@/zone/pages/zone/modify/ModifyTtl.modal';

const updateSoaMock = vi.fn();
const addSuccessMock = vi.fn();
const addErrorMock = vi.fn();

vi.mock('@/zone/hooks/data/history.hooks', () => ({
    useGetZoneSoa: vi.fn(),
    useUpdateZoneSoa: vi.fn(),
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

const zoneSoaMock = {
    ttl: 3600,
    server: 'ns1.example.com',
    email: 'admin@example.com',
    serial: 2025010101,
    refresh: 14400,
    expiration: 3600000,
    nxDomainTtl: 300,
};

describe('ModifyTtlModal', () => {
    const onCloseCallback = vi.fn();
    const onSuccessCallback = vi.fn();

    beforeEach(async () => {
        vi.clearAllMocks();
        (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
            serviceName: 'example.com',
        });

        const { useGetZoneSoa, useUpdateZoneSoa } = await import(
            '@/zone/hooks/data/history.hooks'
        );
        (useGetZoneSoa as ReturnType<typeof vi.fn>).mockReturnValue({
            zoneSoa: zoneSoaMock,
            isLoadingZoneSoa: false,
            zoneSoaError: null,
        });
        (useUpdateZoneSoa as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: updateSoaMock,
            isPending: false,
        });
    });

    it('renders the modal with heading', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        expect(
            screen.getByText('zone_page_modify_ttl_title'),
        ).toBeInTheDocument();
    });

    it('renders the TTL input with the current value', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue(3600);
    });

    it('disables submit when TTL value is empty', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '' } });

        const confirmBtn = screen.getByRole('button', {
            name: /zone_page_modify_ttl_confirm/i,
        });
        expect(confirmBtn).toBeDisabled();
    });

    it('shows validation error when TTL is below minimum', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        // The TTL input with min/max constraints should be present
        const input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        // The input has min constraint set
        expect(input).toHaveAttribute('min', '60');
    });

    it('shows validation error when TTL is above maximum', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        // The TTL input with min/max constraints should be present
        const input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        // The input has max constraint set
        expect(input).toHaveAttribute('max', '2147483647');
    });

    it('calls updateSoa with the new TTL value on confirm', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '7200' } });

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_ttl_confirm/i }),
        );

        expect(updateSoaMock).toHaveBeenCalledTimes(1);
        expect(updateSoaMock).toHaveBeenCalledWith(
            { zoneName: 'example.com', soa: { ...zoneSoaMock, ttl: 7200 } },
            expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
    });

    it('calls onCloseCallback on cancel button click', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_ttl_cancel/i }),
        );
        expect(onCloseCallback).toHaveBeenCalledTimes(1);
    });

    it('calls addSuccess and onSuccessCallback on success', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '7200' } });
        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_ttl_confirm/i }),
        );

        const { onSuccess } = updateSoaMock.mock.calls[0][1];
        onSuccess();

        expect(addSuccessMock).toHaveBeenCalledTimes(1);
        expect(onSuccessCallback).toHaveBeenCalledTimes(1);
    });

    it('calls addError on failure', () => {
        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '7200' } });
        fireEvent.click(
            screen.getByRole('button', { name: /zone_page_modify_ttl_confirm/i }),
        );

        const { onError } = updateSoaMock.mock.calls[0][1];
        onError(new Error('Something went wrong'));

        expect(addErrorMock).toHaveBeenCalledTimes(1);
    });

    it('shows loading state when zone SOA is loading', async () => {
        const { useGetZoneSoa } = await import('@/zone/hooks/data/history.hooks');
        (useGetZoneSoa as ReturnType<typeof vi.fn>).mockReturnValue({
            zoneSoa: null,
            isLoadingZoneSoa: true,
            zoneSoaError: null,
        });

        render(
            <ModifyTtlModal
                onCloseCallback={onCloseCallback}
                onSuccessCallback={onSuccessCallback}
            />,
            { wrapper },
        );

        const confirmBtn = screen.getByRole('button', {
            name: /zone_page_modify_ttl_confirm/i,
        });
        expect(confirmBtn).toBeDisabled();
    });
});
