import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import AssociatedServicesCards from '@/domain/components/AssociatedServicesCards/AssociatedServicesCards';
import { useEmailService } from '@/domain/hooks/data/query';
import { AssociatedEmailsServicesEnum } from '@/domain/enum/associatedServices.enum';

vi.mock('@/domain/hooks/data/query', () => ({
  useEmailService: vi.fn(),
}));

vi.mock('./Emails', () => ({
  default: vi.fn().mockImplementation(() => <div>Emails Component</div>),
}));

describe('AssociatedServicesCards component', () => {
  it('renders with Emails component', async () => {
    (useEmailService as jest.Mock).mockReturnValue({
      data: {
        serviceDetected: AssociatedEmailsServicesEnum.MXPLAN,
        data: 'mxplan-service-id',
      },
    });

    render(<AssociatedServicesCards serviceName="example.com" />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(
          /domain_tab_general_information_associated_services_title/i,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/Emails Component/i)).toBeInTheDocument();
    });
  });
});
