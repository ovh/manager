import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { roadmapItem } from '@/__mocks__/roadmap';

import { RoadmapChangelogItemTitleCell } from './RoadmapChangelogItemTitleCell';

describe('RoadmapChangelogItemTitleCell Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<RoadmapChangelogItemTitleCell item={roadmapItem} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
