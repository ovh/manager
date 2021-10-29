import { IShellPluginMethodCall } from '../../src/common';
import PluginManager, { IPluginEntry } from '../../src/shell/plugin-manager';

describe('Plugin registration', () => {
  it('registers one plugin', () => {
    // Arrange
    const testFunction = () => 'test';
    const expectedPluginEntry: IPluginEntry = {
      id: '1',
      instance: {
        testCall: expect.any(testFunction),
      },
      isAvailable: true,
    };
    const pluginManager = new PluginManager();

    // Act
    pluginManager.registerPlugin('1', {
      testCall: expect.any(testFunction),
    });

    // Assert
    expect(pluginManager.plugins[1]).toEqual(expectedPluginEntry);
  });

  it('throws an error when registering and existing plugin already exists', () => {
    // Arrange
    const testFunction = () => 'test';
    const pluginManager = new PluginManager();

    // Act
    pluginManager.registerPlugin('1', {
      testCall: expect.any(testFunction),
    });

    // Assert
    expect(() => {
      pluginManager.registerPlugin('1', {
        testCall: expect.any(testFunction),
      });
    }).toThrowError(new Error("Plugin '1' is already registered"));
  });
});

describe('Plugin availability', () => {
  it('changes plugin available with given entry', () => {
    // Arrange
    const expectedResult = 'test';
    const testFunction = () => expectedResult;
    const pluginManager = new PluginManager();
    pluginManager.registerPlugin('1', {
      testCall: jest.fn(testFunction),
    });

    // Act
    pluginManager.setPluginAvailability('1', false);

    // Assert
    expect(pluginManager.plugins[1].isAvailable).toBeFalsy();
  });
});

describe('Plugin Invokation', () => {
  it('executes a registered plugin', async () => {
    // Arrange
    const expectedResult = 'test';
    const testFunction = () => expectedResult;
    const pluginManager = new PluginManager();
    let returnResult = '';

    // Act
    pluginManager.registerPlugin('1', {
      testCall: jest.fn(testFunction),
    });
    const callInvocationSignature: IShellPluginMethodCall = {
      plugin: '1',
      method: 'testCall',
    };
    await pluginManager
      .invokePluginMethod(callInvocationSignature)
      .then((callData: string) => {
        returnResult = callData;
      });

    // Assert
    expect(returnResult).toEqual(expectedResult);
  });
});
