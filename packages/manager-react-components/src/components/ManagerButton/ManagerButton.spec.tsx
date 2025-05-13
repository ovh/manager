import React from 'react';
import { vitest } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ManagerButton, ManagerButtonProps } from './ManagerButton';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useAuthorizationIam } from '../../hooks/iam';
import { IamAuthorizationResponse } from '../../hooks/iam/iam.interface';

vitest.mock('../../hooks/iam');

const renderComponent = (props: ManagerButtonProps) => {
  return render(<ManagerButton {...props} />);
};

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('ManagerButton tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('should display manager button', () => {
    it('with true value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        id: 'test-manager-button',
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach-action',
        ],
        label: 'foo-manager-button',
      });
      expect(screen.getByTestId('manager-button')).not.toBeNull();
    });

    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        id: 'test-manager-button',
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach',
        ],
        label: 'fo manager button',
      });
      expect(screen.getByTestId('manager-button-tooltip')).not.toBeNull();
      expect(screen.getByTestId('manager-button-tooltip')).toHaveAttribute(
        'is-disabled',
        'true',
      );
    });
  });

  describe('should display tooltip', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        id: 'manager-button',
        urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/attach-action',
        ],
        label: 'foo-manager-button',
      });
      expect(screen.getByTestId('manager-button-tooltip')).not.toBeNull();
      expect(screen.getByTestId('manager-button-tooltip')).toHaveAttribute(
        'is-disabled',
        'true',
      );
      const button = screen.getByTestId('manager-button-tooltip');
      fireEvent.mouseOver(button);
      expect(
        screen.getAllByText(fr_FR.common_iam_actions_message),
      ).not.toBeNull();
    });
  });
});
