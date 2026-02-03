import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { ResourceStatus } from '@/data/api';
import { render } from '@/utils/test.provider';

import ActionButtonRedirection from './ActionButton.component';

describe('Redirections datagrid action menu', () => {
  it('renders with menu enabled and 2 items', () => {
    render(
      <ActionButtonRedirection
        item={{
          id: '1',
          from: 'testFrom',
          to: 'testTo',
          organization: 'TestOrganization',
          status: ResourceStatus.READY,
        }}
      />,
    );

    const deleteButton = screen.getByTestId('manager-button');
    expect(deleteButton).toHaveTextContent(actionsCommonTranslation.delete);
  });
});
