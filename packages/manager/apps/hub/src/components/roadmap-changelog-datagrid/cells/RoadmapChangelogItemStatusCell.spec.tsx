import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { roadmapItem } from '@/__mocks__/roadmap';

import { RoadmapChangelogItemStatusCell } from './RoadmapChangelogItemStatusCell';

describe('RoadmapChangelogItemStatusCell Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<RoadmapChangelogItemStatusCell item={roadmapItem} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
