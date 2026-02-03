import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { roadmapItem } from '@/__mocks__/roadmap';

import { RoadmapChangelogItemReleaseDateCell } from './RoadmapChangelogItemReleaseDateCell';

describe('RoadmapChangelogItemReleaseDateCell Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<RoadmapChangelogItemReleaseDateCell item={roadmapItem} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
