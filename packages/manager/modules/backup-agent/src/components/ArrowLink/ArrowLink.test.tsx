import { render, screen } from '@testing-library/react';

import { ArrowLink } from './ArrowLink.component';

describe('ArrowLinkCell', () => {
  it('should bind params & override default attributes', () => {
    const href = '#/test';
    const className = 'class-test';
    const dataTestid = 'link-test-id';
    const dataArialabel = 'new aria label';
    const label = 'new label';

    render(
      <ArrowLink
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

  it('should override default className', () => {
    const href = '#/test';
    const fullClassName = 'class-test';
    const dataTestid = 'link-test-id';

    render(
      <ArrowLink
        href={href}
        fullClassName={fullClassName}
        data-testid={dataTestid}
      />,
    );

    const link = screen.getByTestId(dataTestid);

    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('class', fullClassName);
  });
});
