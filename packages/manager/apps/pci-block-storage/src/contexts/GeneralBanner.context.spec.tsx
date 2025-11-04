import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { userEvent } from '@testing-library/user-event';
import {
  GeneralBannerContextProvider,
  useGeneralBannerContext,
} from '@/contexts/GeneralBanner.context';

describe('GeneralBannerContext', () => {
  const testBanner = ({ onRemove }: { onRemove: () => void }) => (
    <button onClick={onRemove} type="button">
      click me
    </button>
  );
  const TestComponent = () => {
    const { addBanner, getBanner } = useGeneralBannerContext();

    useEffect(() => {
      addBanner('testBanner', testBanner);
    }, []);

    return getBanner('testBanner');
  };

  const renderWithGeneralBannerContext = () =>
    render(
      <GeneralBannerContextProvider>
        <TestComponent />
      </GeneralBannerContextProvider>,
    );

  it('should add the banner and display it', () => {
    const { getByText } = renderWithGeneralBannerContext();

    expect(getByText('click me')).toBeVisible();
  });

  it('should remove the banner when onRemoved is triggered', async () => {
    const { getByText, queryByText } = renderWithGeneralBannerContext();

    await userEvent.click(getByText('click me'));

    expect(queryByText('click me')).toBeNull();
  });
});
