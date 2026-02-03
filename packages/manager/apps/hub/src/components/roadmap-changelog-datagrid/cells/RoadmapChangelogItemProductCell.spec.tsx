import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { roadmapItem } from '@/__mocks__/roadmap';

import { RoadmapChangelogItemProductCell } from './RoadmapChangelogItemProductCell';

describe('RoadmapChangelogItemProductCell Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<RoadmapChangelogItemProductCell item={roadmapItem} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
