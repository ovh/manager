import { vi } from 'vitest';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal.component';
import {
  basic as basicMock,
  actions as actionsMock,
  loading as loadingMock,
} from './Modal.mock';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

it('should display the basic modal', () => {
  const { getByTestId } = render(<Modal {...basicMock} />);
  expect(getByTestId('modal')).not.toBeNull();
  expect(screen.queryByText('Example of modal')).not.toBeNull();
  expect(screen.queryByText('Example of content')).not.toBeNull();
});

it('should display the modal with action', async () => {
  const onPrimaryButtonClick = vi.fn(actionsMock.onPrimaryButtonClick);
  const onSecondaryButtonClick = vi.fn(actionsMock.onSecondaryButtonClick);
  const { getByTestId } = render(
    <Modal
      {...basicMock}
      {...actionsMock}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
    />,
  );
  const primaryButton = getByTestId('primary-button');
  const secondaryButton = getByTestId('secondary-button');

  expect(primaryButton).toHaveAttribute('label', 'Confirm');
  expect(primaryButton).toHaveAttribute('color', 'primary');
  expect(primaryButton).toHaveAttribute('variant', 'default');
  expect(primaryButton).toHaveAttribute('is-loading', 'false');
  expect(primaryButton).toHaveAttribute('is-disabled', 'false');

  expect(secondaryButton).toHaveAttribute('label', 'Cancel');
  expect(secondaryButton).toHaveAttribute('color', 'primary');
  expect(secondaryButton).toHaveAttribute('variant', 'ghost');
  expect(secondaryButton).toHaveAttribute('is-loading', 'false');
  expect(secondaryButton).toHaveAttribute('is-disabled', 'false');

  await act(() => fireEvent.click(primaryButton));
  expect(onPrimaryButtonClick).toHaveBeenCalled();

  await act(() => fireEvent.click(secondaryButton));
  expect(onSecondaryButtonClick).toHaveBeenCalled();
});

it('should display the modal with critical type', () => {
  const { getByTestId } = render(
    <Modal {...basicMock} {...actionsMock} type={ODS_MODAL_COLOR.critical} />,
  );
  expect(getByTestId('modal')).not.toBeNull();
  expect(screen.queryAllByTestId(/-button/)).toHaveLength(2);
  const primaryButton = getByTestId('primary-button');
  const secondaryButton = getByTestId('secondary-button');

  expect(primaryButton).toHaveAttribute('label', 'Confirm');
  expect(primaryButton).toHaveAttribute('color', 'critical');
  expect(primaryButton).toHaveAttribute('variant', 'default');
  expect(primaryButton).toHaveAttribute('is-loading', 'false');
  expect(primaryButton).toHaveAttribute('is-disabled', 'false');

  expect(secondaryButton).toHaveAttribute('label', 'Cancel');
  expect(secondaryButton).toHaveAttribute('color', 'critical');
  expect(secondaryButton).toHaveAttribute('variant', 'ghost');
  expect(secondaryButton).toHaveAttribute('is-loading', 'false');
  expect(secondaryButton).toHaveAttribute('is-disabled', 'false');
});

it('should display the modal with loading state', () => {
  const { getByTestId } = render(
    <Modal {...basicMock} {...actionsMock} {...loadingMock} />,
  );
  expect(getByTestId('spinner')).not.toBeNull();
  expect(screen.queryAllByTestId(/-button/)).toHaveLength(0);
});

it('should display the modal with disabled buttons', async () => {
  const onPrimaryButtonClick = vi.fn(actionsMock.onPrimaryButtonClick);
  const onSecondaryButtonClick = vi.fn(actionsMock.onSecondaryButtonClick);
  const { getByTestId } = render(
    <Modal
      {...basicMock}
      {...actionsMock}
      isPrimaryButtonDisabled={true}
      isSecondaryButtonDisabled={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
    />,
  );
  const primaryButton = getByTestId('primary-button');
  const secondaryButton = getByTestId('secondary-button');
  expect(primaryButton).toHaveAttribute('is-disabled', 'true');
  expect(secondaryButton).toHaveAttribute('is-disabled', 'true');

  await act(() => fireEvent.click(primaryButton));
  expect(onPrimaryButtonClick).not.toHaveBeenCalled();

  await act(() => fireEvent.click(secondaryButton));
  expect(onSecondaryButtonClick).not.toHaveBeenCalled();
});

it('should display the basic modal with steps', () => {
  render(<Modal {...basicMock} step={{ current: 1, total: 5 }} />);

  expect(screen.getByTestId('modal')).not.toBeNull();
  expect(screen.queryByText(basicMock.heading)).not.toBeNull();
  expect(screen.queryByText('stepPlaceholder')).not.toBeNull();
});

it('should not display the step count', () => {
  render(<Modal {...basicMock} step={{ total: 5 }} />);

  expect(screen.getByTestId('modal')).not.toBeNull();
  expect(screen.queryByText(basicMock.heading)).not.toBeNull();
  expect(screen.queryByText('stepPlaceholder')).toBeNull();
});
