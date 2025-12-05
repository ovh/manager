import '@/common/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import GeneralInformationsCards from '@/domain/components/InformationsCards/GeneralInformations';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoOK } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

describe('General Informations Tile component', () => {
  it('renders tile with domain states when domain is OK and NOT_SUSPENDED', () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: serviceInfoOK,
    });

    const { getByTestId } = render(
      <GeneralInformationsCards serviceName="example.com" />,
      {
        wrapper,
      },
    );

    expect(getByTestId('manager-tile')).toBeInTheDocument();
  });
});
