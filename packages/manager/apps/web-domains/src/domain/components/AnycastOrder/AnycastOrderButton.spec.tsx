import '@/domain/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { wrapper } from '@/domain/utils/test.provider';
import { OptionStateEnum } from '@/domain/enum/optionState.enum';
import { useGetDomainAnycastOption } from '@/domain/hooks/data/query';
import AnycastOrderButtonComponent from './AnycastOrderButton';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/domain/components/AnycastOrder/AnycastTerminateModal', () => ({
  default: () => <div>Modal</div>,
}));

const mockOnOpenAnycastTerminateModal = vi.fn();

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainAnycastOption: vi.fn(),
}));

describe('AnycastOrderButtonComponent', () => {
  it('displays the loading button when isFetchingAnycastOption', () => {
    (useGetDomainAnycastOption as any).mockReturnValue({
      isFetchingAnycastOption: true,
      anycastOption: undefined,
    });
    const { getByTestId } = render(
      <AnycastOrderButtonComponent
        serviceName="example.com"
        anycastTerminateModalOpen={false}
        onOpenAnycastTerminateModal={mockOnOpenAnycastTerminateModal}
      />,
      { wrapper },
    );
    expect(getByTestId('anycast-loading-button')).toHaveAttribute(
      'disabled',
      '',
    );
  });

  it('displays the command button if anycastOption is undefined', () => {
    (useGetDomainAnycastOption as any).mockReturnValue({
      isFetchingAnycastOption: false,
      anycastOption: undefined,
    });
    render(
      <AnycastOrderButtonComponent
        serviceName="example.com"
        anycastTerminateModalOpen={false}
        onOpenAnycastTerminateModal={mockOnOpenAnycastTerminateModal}
      />,
    );
    expect(
      screen.getByText('domain_dns_tab_button_order_anycast'),
    ).toBeInTheDocument();
  });

  it('displays the restore button if anycastOption.state = released', () => {
    (useGetDomainAnycastOption as any).mockReturnValue({
      isFetchingAnycastOption: false,
      anycastOption: { state: OptionStateEnum.RELEASED.toLowerCase() },
    });
    render(
      <AnycastOrderButtonComponent
        serviceName="example.com"
        anycastTerminateModalOpen={false}
        onOpenAnycastTerminateModal={mockOnOpenAnycastTerminateModal}
      />,
    );
    expect(
      screen.getByText('domain_dns_tab_button_cancel_terminate_anycast'),
    ).toBeInTheDocument();
  });

  it('displays the command button if anycastOption.state = subscribed', () => {
    (useGetDomainAnycastOption as any).mockReturnValue({
      isFetchingAnycastOption: false,
      anycastOption: { state: OptionStateEnum.SUBSCRIBED.toLowerCase() },
    });
    render(
      <AnycastOrderButtonComponent
        serviceName="example.com"
        anycastTerminateModalOpen={false}
        onOpenAnycastTerminateModal={mockOnOpenAnycastTerminateModal}
      />,
    );
    expect(
      screen.getByText('domain_dns_tab_button_cancel_terminate_anycast'),
    ).toBeInTheDocument();
  });

  it('opens the modal to termination', () => {
    (useGetDomainAnycastOption as any).mockReturnValue({
      isFetchingAnycastOption: false,
      anycastOption: { state: OptionStateEnum.SUBSCRIBED.toLowerCase() },
    });
    render(
      <AnycastOrderButtonComponent
        serviceName="example.com"
        anycastTerminateModalOpen={false}
        onOpenAnycastTerminateModal={mockOnOpenAnycastTerminateModal}
      />,
    );
    fireEvent.click(
      screen.getByText('domain_dns_tab_button_cancel_terminate_anycast'),
    );
    expect(mockOnOpenAnycastTerminateModal).toHaveBeenCalled();
  });
});
