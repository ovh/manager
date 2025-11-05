import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import Emails from '@/domain/components/AssociatedServicesCards/Emails';
import { useEmailService } from '@/domain/hooks/data/query';
import { AssociatedEmailsServicesEnum } from '@/domain/enum/associatedServices.enum';

vi.mock('@/domain/hooks/data/query', () => ({
  useEmailService: vi.fn(),
}));

describe('Emails component', () => {
  it('renders with MXPLAN service detected', async () => {
    vi.mocked(useEmailService).mockReturnValue({
      data: {
        serviceDetected: AssociatedEmailsServicesEnum.MXPLAN,
        data: 'mxplan-service-id',
      },
    } as ReturnType<typeof useEmailService>);

    render(<Emails serviceName="example.com" />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(
          /domain_tab_general_information_associated_services_emails_content/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('navigation-action-trigger-action-popover'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/email_domain/example.com',
      );
    });
  });

  it('renders with ZIMBRA service detected', async () => {
    vi.mocked(useEmailService).mockReturnValue({
      data: {
        serviceDetected: AssociatedEmailsServicesEnum.ZIMBRA,
        data: 'zimbra-service-id',
      },
    } as ReturnType<typeof useEmailService>);

    render(<Emails serviceName="example.com" />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(
          /domain_tab_general_information_associated_services_emails_content/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('navigation-action-trigger-action-popover'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://ovh.test/#/zimbra/zimbra-service-id',
      );
    });
  });

  it('renders with default service detected', async () => {
    vi.mocked(useEmailService).mockReturnValue({
      data: {
        serviceDetected: 'UNKNOWN_SERVICE' as AssociatedEmailsServicesEnum,
        data: 'unknown-service-id',
      },
    } as ReturnType<typeof useEmailService>);

    render(<Emails serviceName="example.com" />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(
          /domain_tab_general_information_associated_services_emails_content/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('navigation-action-trigger-action-popover'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/email_domain/example.com/email/redirection',
      );
    });
  });
});
