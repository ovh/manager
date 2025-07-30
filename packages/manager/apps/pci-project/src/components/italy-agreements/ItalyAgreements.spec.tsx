/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, SyntheticEvent } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import ItalyAgreements from '@/components/italy-agreements/ItalyAgreements';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const mod = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...mod,
    OdsCheckbox: ({
      name,
      inputId,
      isChecked,
      onOdsChange,
      children,
    }: {
      name: string;
      inputId: string;
      isChecked: boolean;
      onOdsChange: (e: SyntheticEvent) => void;
      children: ReactNode;
    }) => (
      <>
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={isChecked}
          onChange={(e) => onOdsChange(e)}
        />
        {children}
      </>
    ),
  };
});

describe('ItalyAgreements', () => {
  it('should render with an enabled checkbox', () => {
    const setHasAgreements = vi.fn();
    const { getByRole } = render(
      <ItalyAgreements
        hasAgreements={false}
        onSetHasAgreements={setHasAgreements}
      />,
    );
    expect(getByRole('checkbox')).toBeVisible();
  });
});
