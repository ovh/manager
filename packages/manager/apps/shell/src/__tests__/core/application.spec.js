const { default: Application } = require('../../core/application');

describe('application registration of listeners', () => {
  let app;
  beforeEach(() => {
    const iframe = document.createElement('iframe', { src: '/' });
    app = new Application(iframe);
  });

  it('triggers one registered listener', async () => {
    // Arrange
    const log = jest.fn();
    const testCallback = () => log('test');

    // Act
    app.addHashChangeListener(testCallback);
    app.listenForChanges();
    window.postMessage({ id: 'ovh-iframe-hashchange' }, '*');
    // await setTimeout is necessary here otherwise the listener is never called
    // due to te implementation of postMessage in jsdom
    // Check Github issue : https://github.com/jsdom/jsdom/issues/2245
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert
    expect(log).toHaveBeenCalledWith('test');
  });

  it('triggers multiple listeners', async () => {
    // Arrange
    let count = 0;
    const increment = () => {
      count += 1;
    };
    const log = jest.fn();
    const secondCallback = () => log('second');

    // Act
    app.addHashChangeListener(increment);
    app.addHashChangeListener(secondCallback);
    app.listenForChanges();
    window.postMessage({ id: 'ovh-iframe-hashchange' }, '*');
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert
    expect(count).toEqual(1);
    expect(log).toHaveBeenCalledWith('second');
  });

  it("doesn't trigger listener when no id", async () => {
    // Arrange
    const log = jest.fn();
    const callback = () => log('nothing');

    // Act
    app.addHashChangeListener(callback);
    app.listenForChanges();
    window.postMessage('test', '*');
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert
    expect(log).not.toHaveBeenCalled();
  });
});
