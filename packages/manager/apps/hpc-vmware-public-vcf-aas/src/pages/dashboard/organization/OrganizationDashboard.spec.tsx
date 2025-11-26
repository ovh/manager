import React from 'react';

import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';

import { renderTest } from '../../../test-utils';
import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
  };
});

const testOrg = organizationList[0];

describe('Organization Dashboard Page', () => {
  it('display the VCD dashboard page', async () => {
    await renderTest({ initialRoute: `/${testOrg.id}` });

    const texts = [
      testOrg.currentState.fullName,
      testOrg.currentState.description,
      VIRTUAL_DATACENTERS_LABEL,
    ];

    await Promise.all(texts.map((text) => assertTextVisibility(text)));
    expect(screen.getAllByText(testOrg.currentState.fullName).length).toBeGreaterThan(0);
  });

  it('display an error if organization service is KO', async () => {
    await renderTest({
      initialRoute: `/${testOrg.id}`,
      isOrganizationKo: true,
    });

    await assertTextVisibility('Organization error');
  });
});
