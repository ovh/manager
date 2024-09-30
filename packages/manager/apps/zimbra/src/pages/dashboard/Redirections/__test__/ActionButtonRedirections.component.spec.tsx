import React from 'react';
import { vi, describe, expect } from 'vitest';
import ActionButtonRedirections from '../ActionButtonRedirections.component';
import { render } from '@/utils/test.provider';
import { platformMock } from '@/api/_mock_';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    usePlatform: vi.fn(() => ({
      platformUrn: platformMock[0].iam.urn,
    })),
  };
});

describe('Redirections datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonRedirections
        redirectionsItem={{
          id: '1',
          from: 'testFrom',
          to: 'testTo',
          organization: 'TestOrganization',
        }}
      />,
    );

    expect(container.querySelectorAll('osds-menu-item').length).toBe(2);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      redirectionsTranslation.zimbra_redirections_datagrid_tooltip_modification,
    );

    expect(container.querySelectorAll('osds-menu-item')[1]).toHaveTextContent(
      redirectionsTranslation.zimbra_redirections_datagrid_tooltip_delete,
    );
  });
});
