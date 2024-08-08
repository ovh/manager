import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RegionLabel from './RegionLabel.component';

describe('RegionLabel component unit test suite', () => {
  it.each([
    ['', '-'],
    [null, '-'],
    ['xxx-yyy-zzz', 'region_xxx_yyy_zzz'],
    ['AAA-yyy-zzz', 'region_aaa_yyy_zzz'],
  ])('when code is "%s" should return "%s" as label region', (code, region) => {
    // when
    const { getByText } = render(<RegionLabel code={code} />);

    // then
    expect(getByText(region)).toBeDefined();
  });
});
