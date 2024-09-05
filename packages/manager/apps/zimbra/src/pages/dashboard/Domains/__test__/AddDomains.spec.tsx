import React from 'react';
import { vi, describe, expect } from 'vitest';
import AddDomain from '../AddDomain';
import { render } from '@/utils/test.provider';
import addDomainTranslation from '@/public/translations/domains/addDomain/Messages_fr_FR.json';
import { platformMock, organizationListMock } from '@/api/_mock_';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useOrganization: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
    useOrganizationList: vi.fn(() => ({
      data: organizationListMock,
      isLoading: false,
    })),
    useOverridePage: vi.fn(() => true),
    useGenerateUrl: vi.fn(() => null),
  };
});

describe('Add Domains page', () => {
  const { getByTestId } = render(<AddDomain />);
  it('Page should display correctly', () => {
    const page = getByTestId('add-domain-page');
    expect(page).toHaveTextContent(
      addDomainTranslation.zimbra_domains_add_domain_title_select,
    );
  });
});
