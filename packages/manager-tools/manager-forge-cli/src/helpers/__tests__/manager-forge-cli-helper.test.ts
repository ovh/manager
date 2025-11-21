import type { Options as BoxenOptions } from 'boxen';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Answers } from '@/types/PromptType.js';

type UiModule = typeof import('../manager-forge-cli-helper.js');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const boxenMock = vi.fn((text: string, _options: BoxenOptions) => `BOX:${text}`);

const cfontsRenderMock = vi.fn(() => ({
  string: '  MOCK TITLE  \n',
}));

const oraSucceedMock = vi.fn();
const spinnerInstance = {
  succeed: oraSucceedMock,
};
const oraStartMock = vi.fn(() => spinnerInstance);
const oraMock = vi.fn(() => ({
  start: oraStartMock,
}));

vi.mock('boxen', () => ({
  default: boxenMock,
}));

vi.mock('cfonts', () => ({
  default: {
    render: cfontsRenderMock,
  },
}));

vi.mock('ora', () => ({
  default: oraMock,
}));

let ui: UiModule;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules(); // ensure fresh instance of the module under test
  ui = await import('../manager-forge-cli-helper.js');
});

afterEach(() => {
  // Important: DON'T use restoreAllMocks here, it resets vi.fn implementations.
  vi.useRealTimers();
});

describe('getThemeColors', () => {
  it('returns the expected OVH FORGE CLI theme palette', () => {
    const colors = ui.getThemeColors();

    expect(colors).toEqual({
      primary: '#16A0FF',
      secondary: '#B0C4DE',
      accent: '#16A085',
      background: '#0A1638',
      text: '#FFFFFF',
    });
  });
});

describe('renderTitle', () => {
  it('renders a title with CFonts and trims whitespace', () => {
    const result = ui.renderTitle('Forge Cli');

    // CFonts.render is called with uppercased text
    expect(cfontsRenderMock).toHaveBeenCalledTimes(1);

    const cfontsRenderCall = cfontsRenderMock.mock.calls[0];
    expect(cfontsRenderCall).toBeDefined();
    expect(cfontsRenderCall).toHaveLength(2);

    const [textArg, optionsArg] = cfontsRenderCall as unknown as [string, unknown];

    expect(textArg).toBe('FORGE CLI');
    expect(typeof optionsArg).toBe('object');

    // Return value is trimmed version of CFonts output
    expect(result).toBe('MOCK TITLE');
  });

  it('falls back to plain uppercased text if CFonts.render returns invalid value', () => {
    cfontsRenderMock.mockReturnValueOnce(null as unknown as { string: string });

    const result = ui.renderTitle('my title');

    expect(result).toBe('MY TITLE');
  });
});

describe('renderBanner', () => {
  it('prints a boxen banner with title and subtitle', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const subtitle = 'Custom subtitle';
    ui.renderBanner(subtitle);

    expect(boxenMock).toHaveBeenCalledTimes(1);

    const [content, options] = boxenMock.mock.calls[0] as [string, BoxenOptions];

    const theme = ui.getThemeColors();

    // Content should contain the rendered title and subtitle
    expect(content).toContain('MOCK TITLE');
    expect(content).toContain(subtitle);

    expect(options).toMatchObject<Partial<BoxenOptions>>({
      borderStyle: 'double',
      borderColor: theme.primary,
      backgroundColor: theme.background,
      align: 'center',
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('BOX:'));

    consoleLogSpy.mockRestore();
  });
});

describe('showInitializationSpinner', () => {
  it('starts and succeeds an ora spinner after a small delay', async () => {
    vi.useFakeTimers();

    const promise = ui.showInitializationSpinner();

    await vi.advanceTimersByTimeAsync(800);
    await promise;

    expect(oraMock).toHaveBeenCalledTimes(1);
    expect(oraStartMock).toHaveBeenCalledTimes(1);
    expect(oraSucceedMock).toHaveBeenCalledTimes(1);

    const succeedArg = oraSucceedMock?.mock?.calls?.[0]?.[0] as string;
    expect(succeedArg).toContain('Ready.');

    vi.useRealTimers();
  });
});

describe('displayAppGenerationSummary', () => {
  it('clears the console and prints a summary', () => {
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const answers: Answers = {
      appName: 'my-app',
      packageName: '@org/my-app',
      description: 'My test app',
      regions: ['EU', 'US'],
      universes: ['Dedicated', 'Manager'],
      level2: '56',
      universe: 'WebCloud',
      subUniverse: 'Sunrise',
    };

    ui.displayAppGenerationSummary(answers);

    expect(clearSpy).toHaveBeenCalledTimes(1);

    const allLogs = logSpy.mock.calls.map((c) => String(c[0])).join('\n');

    expect(allLogs).toContain('Generation configuration summary');
    expect(allLogs).toContain('Application Name:');
    expect(allLogs).toContain('my-app');
    expect(allLogs).toContain('Package Name:');
    expect(allLogs).toContain('@org/my-app');
    expect(allLogs).toContain('Regions:');
    expect(allLogs).toContain('EU, US');

    clearSpy.mockRestore();
    logSpy.mockRestore();
  });
});

describe('runForgeCli', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('shows help and does not run the command when --help is passed and helpText is provided', async () => {
    const commandFn = vi.fn();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    process.argv = ['node', 'script', '--help'];

    await ui.runForgeCli(commandFn, {}, 'Some help text');

    const firstArg = logSpy?.mock?.calls?.[0]?.[0] as string;

    expect(String(firstArg)).toContain('Some help text');
    expect(commandFn).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('runs the command in normal mode without banner/spinner when disabled in options', async () => {
    const commandFn = vi.fn();
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const renderBannerSpy = vi.spyOn(ui, 'renderBanner').mockImplementation(() => {});
    const spinnerSpy = vi.spyOn(ui, 'showInitializationSpinner').mockResolvedValue(undefined);

    process.argv = ['node', 'script'];

    await ui.runForgeCli(commandFn, {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    });

    expect(commandFn).toHaveBeenCalledTimes(1);
    expect(clearSpy).not.toHaveBeenCalled();
    expect(renderBannerSpy).not.toHaveBeenCalled();
    expect(spinnerSpy).not.toHaveBeenCalled();

    clearSpy.mockRestore();
    renderBannerSpy.mockRestore();
    spinnerSpy.mockRestore();
  });

  it('logs an error and exits with code 1 if the command throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      // prevent actual exit during tests
    }) as never);

    const failingCommand = vi.fn(() => {
      throw new Error('Boom!');
    });

    process.argv = ['node', 'script'];

    await ui.runForgeCli(failingCommand, {
      clearScreen: false,
      showBanner: false,
      showSpinner: false,
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = String(errorSpy?.mock?.calls?.[0]?.[0]);
    expect(logged).toContain('Boom!');

    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
