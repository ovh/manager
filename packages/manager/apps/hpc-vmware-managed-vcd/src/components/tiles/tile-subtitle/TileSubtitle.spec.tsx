import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import TileSubtitle from './TileSubtitle.component';

describe('TileSubtitle component unit test suite', () => {
  it('should set default typo size for given text', () => {
    // given
    const titleText = 'my title';

    // when
    const { getByText } = render(<TileSubtitle>{titleText}</TileSubtitle>);

    // then
    expect(getByText(titleText)).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._200,
    );
  });
});
