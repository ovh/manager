import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OvhProductName from '../utils/OvhProductNameEnum';
import { SvgIconWrapper } from '../utils/SvgIconWrapper';
import { iconRawMap } from './iconsRawMap';

function parseSVG(svgString: string): SVGSVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  return doc.documentElement as unknown as SVGSVGElement;
}

function normalizeAttributes(el: Element): Record<string, string> {
  const decodeHtmlEntities = (value: string): string =>
    value
      .replace(/&([a-z]+);/gi, (_, name) => {
        const map: Record<string, string> = {
          amp: '&',
          lt: '<',
          gt: '>',
          quot: '"',
          apos: "'",
        };
        return map[name] || _;
      })
      .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return Array.from(el.attributes).reduce(
    (acc, attr) => {
      const cleaned = attr.value
        .replace(/\s+/g, ' ') // normalize multiple spaces
        .replace(/;$/, '') // remove trailing ;
        .trim(); // remove surrounding whitespace
      acc[attr.name] = decodeHtmlEntities(cleaned);
      return acc;
    },
    {} as Record<string, string>,
  );
}

function filterElementChildren(el: Element): Element[] {
  return Array.from(el.childNodes).filter((n): n is Element => n.nodeType === 1);
}

describe('SvgIconWrapper', () => {
  Object.entries(iconRawMap).forEach(([enumKey, rawSvg]) => {
    it(`renders ${enumKey} SVG content correctly`, () => {
      const { container } = render(<SvgIconWrapper name={enumKey as OvhProductName} />);

      const renderedSvg = container.querySelector('svg');
      expect(renderedSvg).toBeTruthy();

      const expectedSvg = parseSVG(rawSvg);

      const actualChildren = filterElementChildren(renderedSvg!);
      const expectedChildren = filterElementChildren(expectedSvg);

      expect(actualChildren.length).toBe(expectedChildren.length);

      actualChildren.forEach((actualChild, i) => {
        const expectedChild = expectedChildren[i];

        expect(actualChild.tagName).toBe(expectedChild.tagName);

        const actualAttrs = normalizeAttributes(actualChild);
        const expectedAttrs = normalizeAttributes(expectedChild);

        expect(actualAttrs).toEqual(expectedAttrs);
      });
    });
  });
});
