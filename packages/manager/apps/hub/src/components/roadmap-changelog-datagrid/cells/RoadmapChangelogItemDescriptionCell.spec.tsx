import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { roadmapItem } from '@/__mocks__/roadmap';

import { RoadmapChangelogItemDescriptionCell } from './RoadmapChangelogItemDescriptionCell';

describe('RoadmapChangelogItemDescriptionCell Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<RoadmapChangelogItemDescriptionCell item={roadmapItem} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
