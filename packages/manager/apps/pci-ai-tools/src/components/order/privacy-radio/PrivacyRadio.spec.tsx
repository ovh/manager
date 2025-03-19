import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import PrivacyRadioInput from './PrivacyRadio.component';
import { PrivacyEnum } from '@/types/orderFunnel';

describe('Privacy input component', () => {
  const onChange = vi.fn();
  it('should call display radio and call onChange with public', async () => {
    render(
      <PrivacyRadioInput onChange={onChange} value={PrivacyEnum.public} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-radio-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('private-radio'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(PrivacyEnum.private);
    });
  });

  it('should call display radio and call onChange with private', async () => {
    render(
      <PrivacyRadioInput onChange={onChange} value={PrivacyEnum.private} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-radio-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('public-radio'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(PrivacyEnum.public);
    });
  });
});
