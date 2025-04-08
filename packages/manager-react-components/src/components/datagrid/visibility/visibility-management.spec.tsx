import { vitest } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { VisibilityManagement } from './visibility-management.component';

vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual(
    '@ovhcloud/ods-components/react',
  );
  return {
    ...originalModule,
    OdsCheckbox: ({ name, inputId, isDisabled, isChecked, onOdsChange }) => {
      return (
        <input
          type="checkbox"
          name={name}
          id={inputId}
          checked={isChecked}
          disabled={isDisabled}
          onChange={onOdsChange}
        />
      );
    },
  };
});

describe('visibility management button part', () => {
  it('should display visibility with one disabled and only this disabled is shown', () => {
    render(
      <VisibilityManagement
        columnsVisibility={[
          {
            id: 'label',
            label: 'Label',
            enableHiding: false,
            isDisabled: true,
            isVisible: () => true,
            onChange: () => null,
          },
          {
            id: 'price',
            label: 'Price',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => false,
            onChange: () => null,
          },
        ]}
      />,
    );

    const visibilityElement = screen.queryByTestId(
      'datagrid-topbar-visibility-button',
    );

    expect(visibilityElement).toHaveAttribute(
      'label',
      'common_topbar_columns (1)',
    );
  });

  it('should display visibility with all available and one shown', () => {
    render(
      <VisibilityManagement
        columnsVisibility={[
          {
            id: 'label',
            label: 'Label',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => true,
            onChange: () => null,
          },
          {
            id: 'price',
            label: 'Price',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => false,
            onChange: () => null,
          },
        ]}
      />,
    );

    const visibilityElement = screen.queryByTestId(
      'datagrid-topbar-visibility-button',
    );

    expect(visibilityElement).toHaveAttribute(
      'label',
      'common_topbar_columns (1)',
    );
  });
});

describe('visibility management dropdown part', () => {
  it('should display visibility with all available and all shown', () => {
    render(
      <VisibilityManagement
        columnsVisibility={[
          {
            id: 'label',
            label: 'Label',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => true,
            onChange: () => null,
          },
          {
            id: 'price',
            label: 'Price',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => true,
            onChange: () => null,
          },
        ]}
      />,
    );

    const checkboxElements = screen.queryAllByRole('checkbox');
    expect(checkboxElements[0]).toHaveProperty('checked', true);
    expect(checkboxElements[0]).toHaveProperty('disabled', false);

    expect(checkboxElements[1]).toHaveProperty('checked', true);
    expect(checkboxElements[1]).toHaveProperty('disabled', false);
  });

  it('should display visibility column disabled', async () => {
    const onChange = vitest.fn(() => null);
    render(
      <VisibilityManagement
        columnsVisibility={[
          {
            id: 'label',
            label: 'Label',
            enableHiding: false,
            isDisabled: true,
            isVisible: () => true,
            onChange,
          },
          {
            id: 'price',
            label: 'Price',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => false,
            onChange,
          },
        ]}
      />,
    );

    const checkboxElements = screen.queryAllByRole('checkbox');
    expect(checkboxElements[0]).toHaveProperty('checked', true);
    expect(checkboxElements[0]).toHaveProperty('disabled', true);

    expect(checkboxElements[1]).toHaveProperty('checked', false);
    expect(checkboxElements[1]).toHaveProperty('disabled', false);

    await act(() => fireEvent.click(checkboxElements[1]));
    expect(onChange).toHaveBeenCalled();
  });
});
