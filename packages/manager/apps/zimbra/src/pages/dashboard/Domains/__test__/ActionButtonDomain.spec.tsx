import React from 'react';
import { vi, describe, expect } from 'vitest';
import ActionButtonDomain from '../ActionButtonDomain.component';
import { render } from '@/utils/test.provider';
import domainTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import { domainMock, platformMock } from '@/api/_mock_';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    usePlatform: vi.fn(() => ({
      platformUrn: platformMock[0].iam.urn,
    })),
  };
});

describe('Domains datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonDomain domainItem={domainMock[0]} />,
    );

    expect(container.querySelectorAll('osds-menu-item').length).toBe(1);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      domainTranslation.zimbra_domains_tooltip_delete,
    );
  });
});
