import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const actual = await vi.importActual<any>('@ovhcloud/ods-components/react');

  return {
    ...actual,
    OdsCheckbox: (props: any) => (
      <input
        type="checkbox"
        name={props.name}
        id={props.id}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
    ),
    OdsRadio: () => <input type="radio" name="radio-order-compute" />,
  };
});
