import { MouseEventHandler } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { EditInline } from './edit-inline.component';

// Mock external UI library components to keep tests deterministic
vi.mock('@ovh-ux/manager-react-components', () => ({
  ManagerButton: (props: { id: string; onClick: MouseEventHandler }) => (
    <button
      data-testid={`manager-button-${props.id}`}
      onClick={props.onClick}
      aria-label="manager-button"
    />
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsInput: (props: {
    'data-testid': string;
    defaultValue: string;
    onOdsChange: (e: { detail: { value: string } }) => void;
  }) => (
    <input
      data-testid={props['data-testid'] || 'ods-input'}
      defaultValue={props.defaultValue}
      onChange={(e) =>
        props.onOdsChange &&
        props.onOdsChange({ detail: { value: e.target.value } })
      }
    />
  ),
  OdsButton: (props: {
    onClick: MouseEventHandler;
    icon: string;
    label: string;
  }) => (
    <button onClick={props.onClick} aria-label={props.icon}>
      {props.label}
    </button>
  ),
}));

describe('EditInline', () => {
  it('renders children and manager button', () => {
    const onConfirm = vi.fn();
    render(
      <EditInline name="test" defaultValue="default" onConfirm={onConfirm}>
        {'display-value'}
      </EditInline>,
    );

    expect(screen.getByText('display-value')).toBeDefined();
    expect(screen.getByTestId('manager-button-test')).toBeDefined();
  });

  it('opens input when manager button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <EditInline name="test" defaultValue="default" onConfirm={onConfirm}>
        {'display-value'}
      </EditInline>,
    );

    fireEvent.click(screen.getByTestId('manager-button-test'));

    expect(screen.getByTestId('edit-inline-input')).toBeDefined();
  });

  it('calls onConfirm with changed value and hides input', () => {
    const onConfirm = vi.fn();
    render(
      <EditInline name="test" defaultValue="default" onConfirm={onConfirm}>
        {'display-value'}
      </EditInline>,
    );

    // open
    fireEvent.click(screen.getByTestId('manager-button-test'));

    const input = screen.getByTestId('edit-inline-input');
    fireEvent.change(input, { target: { value: 'new-value' } });

    // confirm button uses aria-label equal to icon prop (mocked)
    const confirmButton = screen.getByLabelText('check');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith('new-value');
    // input should be hidden after confirm
    expect(screen.queryByTestId('edit-inline-input')).toBeNull();
  });

  it('calls onConfirm with default value when nothing changed', () => {
    const onConfirm = vi.fn();
    render(
      <EditInline name="test" defaultValue="default" onConfirm={onConfirm}>
        {'display-value'}
      </EditInline>,
    );

    // open
    fireEvent.click(screen.getByTestId('manager-button-test'));

    const confirmButton = screen.getByLabelText('check');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith('default');
  });

  it('cancels editing when xmark button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <EditInline name="test" defaultValue="default" onConfirm={onConfirm}>
        {'display-value'}
      </EditInline>,
    );

    fireEvent.click(screen.getByTestId('manager-button-test'));

    const cancelButton = screen.getByLabelText('xmark');
    fireEvent.click(cancelButton);

    // input should be hidden and onConfirm not called
    expect(screen.queryByTestId('edit-inline-input')).toBeNull();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
