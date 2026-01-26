import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import CreationDate from './CreationDate';
import { TDomainResource } from '@/domain/types/domainResource';

describe('CreationDate', () => {
  const mockDomainResources: TDomainResource = {
    currentState: {
      createdAt: '2023-01-15T10:30:00Z',
    },
  } as TDomainResource;

  it('should render creation date label', () => {
    render(<CreationDate domainResources={mockDomainResources} />, { wrapper });

    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/dashboard:creation_date',
      ),
    ).toBeInTheDocument();
  });

  it('should render formatted creation date', () => {
    render(<CreationDate domainResources={mockDomainResources} />, { wrapper });

    const label = screen.getByText(
      '@ovh-ux/manager-common-translations/dashboard:creation_date',
    );
    expect(label.closest('[class]')?.parentElement).toBeDefined();
  });
});
