/* eslint-disable @typescript-eslint/ban-ts-comment */
import { waitFor, screen } from '@testing-library/react';
import { useFeatureAvailability } from './useFeatureAvailability';
import { render } from '../../utils/test.provider';
import '@testing-library/jest-dom';

const featureAvailabilityError = 'Feature availability service error';

const Example = () => {
  const { data, isError, error, isSuccess } = useFeatureAvailability([
    'feature1',
    'feature2',
  ]);

  return (
    <>
      {isError && <div>{error.response.data.message}</div>}
      {isSuccess && data.feature1 && <div>feature1 available</div>}
      {isSuccess && data.feature2 && <div>feature2 available</div>}
    </>
  );
};
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('./useFeatureAvailability', () => ({
  useFeatureAvailability: jest.fn(),
}));

const setupTest = (useCase: 'error' | 'ok') => {
  return render(<Example />);
};

describe('useFeatureAvailability', () => {
  it('displays an error if the service is KO', async () => {
    // @ts-ignore
    useFeatureAvailability.mockReturnValue({
      data: {},
      isError: true,
      error: {
        response: {
          data: {
            message: featureAvailabilityError,
          },
        },
      },
      status: 500,
      totalCount: 0,
    });
    setupTest('error');
    await waitFor(() =>
      expect(screen.getByText(featureAvailabilityError)).toBeVisible(),
    );
  });

  it('display only the features that are available', async () => {
    // @ts-ignore
    useFeatureAvailability.mockReturnValue({
      data: {
        feature1: true,
        feature2: false,
      },
      isSuccess: true,
      status: 200,
      totalCount: 3,
    });
    setupTest('ok');
    await waitFor(() => {
      expect(screen.getByText('feature1 available')).toBeVisible();
      expect(screen.queryByText('feature2 available')).not.toBeInTheDocument();
    });
  });
});
