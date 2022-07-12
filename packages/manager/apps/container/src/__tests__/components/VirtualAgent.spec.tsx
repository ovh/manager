import VirtualAgent from '../../components/VirtualAgent';

// TODO : Currently, jsdom doesn't support <dialog> and HTMLDialogElement, which makes the component not testable
// Link to the issue : https://github.com/jsdom/jsdom/issues/3294
// Also, if we start using Chakra, we can replace the dialog element by the Popover element that is also WCAG compliant.
// Keep this empty test as a reminder to test the component when the situation changes.
describe('empty test', () => {
  it('passes', () => {
    console.warn(
      // eslint-disable-next-line no-multi-str
      'IMPORTANT: VirtualAgent component currently not testable due to jsdom issue related to HTMLDialogElement API\
      please keep this warning till the situation evolves as this does not prevent the test from passing',
    );
  });
});
