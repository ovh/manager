import { Application, Environment } from '@ovh-ux/manager-config';

import navigationPlugin from '../../../src/plugin/navigation';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';
import { vi } from 'vitest';

describe('Test navigation plugin', () => {
  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);

  it('Retrieving a URL', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          href: '',
          hostname: 'ovh',
        },
      });
    });

    const navPlugin = navigationPlugin(
      new Environment(({
        applications: {
          dedicated: {
            publicURL: 'https://example.com/manager/#/foo',
          },
        },
      } as unknown) as Environment),
    );
    let desiredURL = navPlugin.getURL('dedicated', '#/this/is/:what', {
      what: 'awesome',
    });

    // The URL genered contains the hostname, we need to remove this to check the URL
    const hashIndex = desiredURL.indexOf('/#/');
    desiredURL =
      hashIndex !== -1 ? desiredURL.substring(hashIndex) : desiredURL;
    expect(desiredURL).toBe('/#/foo/this/is/awesome');
  });
});
