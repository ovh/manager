import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import React from 'react';
import { TabContentWrapper } from './TabContentWrapper.component';

type Data = {
  description?: string;
  children: React.ReactNode;
};

const children1: React.ReactNode = (
  <div data-testid="foo-child">
    <span>Foo</span>
  </div>
);

describe('TabContentWrapper component', () => {
  test.each`
    description          | children
    ${undefined}         | ${null}
    ${'foo description'} | ${null}
    ${'bar description'} | ${children1}
  `(
    'Should render correctly the tab content wrapper with an optional description <$description> and its children',
    ({ description, children }: Data) => {
      render(
        <TabContentWrapper description={description}>
          {children}
        </TabContentWrapper>,
      );
      const tabContentWrapperElt = screen.getByTestId('tab-content-wrapper');
      expect(tabContentWrapperElt).toBeInTheDocument();
      expect(tabContentWrapperElt).toHaveClass('p-6 pt-8');
      if (description) {
        const descriptionElt = screen.getByText(description);
        expect(descriptionElt).toBeInTheDocument();
      }
      if (children) {
        const childrenElt = screen.getByTestId('foo-child');
        expect(childrenElt).toBeInTheDocument();
      }
    },
  );
});
