import { render, screen } from '@testing-library/react';

import { ArrowLinkCell } from './ArrowLinkCell.component';

describe('ArrowLinkCell', () => {
  it('should bind params & override default attributes', () => {
    const href = '#/test';
    const className = 'class-test';
    const dataTestid = 'link-test-id';
    const dataArialabel = 'new aria label';
    const label = 'new label';

    render(
      <ArrowLinkCell
        href={href}
        isDisabled={true}
        className={className}
        data-testid={dataTestid}
        label={label}
        data-arialabel={dataArialabel}
      />,
    );

    const link = screen.getByTestId(dataTestid);

    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('is-disabled', 'true');
    expect(link).toHaveAttribute(
      'class',
      `[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none ${className}`,
    );
    expect(link).toHaveAttribute('label', label);
    expect(link).toHaveAttribute('data-arialabel', dataArialabel);
  });
});
