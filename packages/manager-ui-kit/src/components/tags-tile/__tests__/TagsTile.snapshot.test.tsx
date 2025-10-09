import { vitest } from 'vitest';
import { TagsTile } from '../TagsTile.component';
import { render } from '../../../utils/test.provider';

describe('TagsTile Snapshot Tests', () => {
  const mockOnEditTags = vitest.fn();

  afterEach(() => {
    vitest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should render empty tags tile', () => {
      const { container } = render(
        <TagsTile tags={{}} onEditTags={mockOnEditTags} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render with null tags', () => {
      const { container } = render(
        <TagsTile tags={null} onEditTags={mockOnEditTags} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render without onEditTags callback', () => {
      const { container } = render(<TagsTile tags={{}} />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('With Tags', () => {
    const mockTags = {
      environment: 'production',
      team: 'frontend',
      version: '1.0.0',
    };

    it('should render tags tile with tags', () => {
      const { container } = render(
        <TagsTile tags={mockTags} onEditTags={mockOnEditTags} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render with custom lineNumber', () => {
      const { container } = render(
        <TagsTile tags={mockTags} onEditTags={mockOnEditTags} lineNumber={3} />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render with displayInternalTags enabled', () => {
      const { container } = render(
        <TagsTile
          tags={mockTags}
          onEditTags={mockOnEditTags}
          displayInternalTags={true}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with many tags', () => {
      const manyTags = {
        env: 'production',
        team: 'frontend',
        version: '1.0.0',
        region: 'eu-west-1',
        owner: 'john-doe',
        project: 'my-project',
        cost_center: 'engineering',
        department: 'IT',
      };

      const { container } = render(
        <TagsTile
          tags={manyTags}
          onEditTags={mockOnEditTags}
          lineNumber={10}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render with single tag', () => {
      const singleTag = { environment: 'staging' };

      const { container } = render(
        <TagsTile tags={singleTag} onEditTags={mockOnEditTags} />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
