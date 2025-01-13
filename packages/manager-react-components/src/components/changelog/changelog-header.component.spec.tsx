import {
  ChangelogHeader,
  ChangelogHeaderProps,
} from './changelog-header.component';
import { render } from '../../utils/test.provider';

const renderComponent = (props: ChangelogHeaderProps) => {
  return render(<ChangelogHeader {...props} />);
};

const changelogs = [
  {
    key: 'foo-changelog',
    url: 'foo-url',
    label: 'foo-label',
  },
  {
    key: 'bar-changelog',
    url: 'bar-url',
    label: 'bar-label',
  },
];

describe('ChangelogHeader tests', () => {
  it('should display changelogs list', () => {
    const { container } = renderComponent({
      label: 'Roadmap & changelog',
      changelogs,
    });
    expect(container.querySelector('[label="foo-changelog"]')).not.toBeNull();
    expect(container.querySelector('[label="bar-changelog"]')).not.toBeNull();
  });
});
