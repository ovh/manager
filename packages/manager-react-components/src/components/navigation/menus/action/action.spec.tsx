import React from 'react';
import { vitest } from 'vitest';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuProps } from './action.component';
import { render } from '../../../../utils/test.provider';
import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';

vitest.mock('../../../../hooks/iam');

const actionItems: ActionMenuProps = {
  items: [
    {
      id: 1,
      onClick: () => window.open('/'),
      label: 'Action 1',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
    {
      id: 2,
      onClick: () => window.open('/'),
      label: 'Action 2',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
  ],
};

const setupSpecTest = async (customProps?: Partial<ActionMenuProps>) =>
  waitFor(() => render(<ActionMenu {...actionItems} {...customProps} />));

const mockedHook = (useAuthorizationIam as unknown) as jest.Mock<
  IamAuthorizationResponse
>;

describe('ActionMenu', () => {
  it('renders menu actions correctly', async () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
    await setupSpecTest();

    const actionMenuIcon = screen.getByTestId('action-menu-icon');
    fireEvent.click(actionMenuIcon);

    // Wait for the button text to update
    await waitFor(() => {
      const action1 = screen.getByText('Action 1');
      const action2 = screen.getByText('Action 2');
      expect(action1).toBeInTheDocument();
      expect(action2).toBeInTheDocument();
      expect(actionMenuIcon.getAttribute('name')).toBe('arrow-down-concept');
    });
  });

  it('renders compact menu with classic ellipsis correctly', async () => {
    await setupSpecTest({ isCompact: true });
    const actionMenuIcon = screen.getByTestId('action-menu-icon');
    expect(actionMenuIcon.getAttribute('name')).toBe('ellipsis');
  });

  it('renders compact menu with custom icon menu correctly', async () => {
    await setupSpecTest({
      icon: ODS_ICON_NAME.ELLIPSIS_VERTICAL,
    });
    const actionMenuIcon = screen.getByTestId('action-menu-icon');
    expect(actionMenuIcon.getAttribute('name')).toBe('ellipsis-vertical');
  });
});
