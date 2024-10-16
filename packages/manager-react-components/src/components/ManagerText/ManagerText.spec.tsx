import { screen } from '@testing-library/react';
import { ManagerText, ManagerTextProps } from './ManagerText';
import { render } from '../../utils/test.provider';
import fr_FR from './translations/Messages_fr_FR.json';
import { useAuthorizationIam } from '../../hooks/iam';
import { IamAuthorizationResponse } from '../../hooks/iam/iam.interface';

jest.mock('../../hooks/iam');

const renderComponent = (props: ManagerTextProps) => {
  return render(<ManagerText {...props} />);
};
const mockedHook = (useAuthorizationIam as unknown) as jest.Mock<
  IamAuthorizationResponse
>;

describe('ManagerText tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should display manager text', () => {
    it('with true value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        urn:
          'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/get-display',
        ],
        children: <div>foo-manager-text</div>,
      });
      expect(screen.getAllByText('foo-manager-text')).not.toBeNull();
    });
  });
  describe('should display error manager text', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      renderComponent({
        urn:
          'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
        iamActions: [
          'manager-react-components:apiovh:manager-react-components/get-display',
        ],
        children: <div>foo-manager-text</div>,
      });
      expect(screen.findByText(fr_FR.iam_hidden_text)).not.toBeNull();
    });
  });
});
