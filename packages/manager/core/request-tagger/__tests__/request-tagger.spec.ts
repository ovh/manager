import {
  addHeadersOverride,
  defineApplicationVersion,
  defineCurrentPage,
  getApplicationVersion,
  getHeaders,
  getHeadersOverride,
  Header,
  removeHeadersOverride,
} from '../src';

beforeEach(() => {
  delete window.ovhRequestTaggerNavigationId;
  delete window.ovhRequestTaggerRequestIndex;
});

describe('Headers generation', () => {
  it('returns no header for invalid url', () => {
    const headers = getHeaders('/api/endpoint');

    expect(Object.keys(headers)).toHaveLength(0);
  });

  it('returns no header for empty url', () => {
    const headers = getHeaders('');

    expect(Object.keys(headers)).toHaveLength(0);
  });

  it('returns headers for valid urls', () => {
    const apiv6Headers = getHeaders('/engine/apiv6/endpoint');
    const aapiHeaders = getHeaders('/engine/2api/endpoint');

    const expectedHeaders = [
      Header.NAVIGATION_ID,
      Header.REQUEST_ID,
      Header.PAGE,
    ];
    expect(Object.keys(apiv6Headers)).toEqual(
      expect.arrayContaining(expectedHeaders),
    );

    expect(Object.keys(aapiHeaders)).toEqual(
      expect.arrayContaining(expectedHeaders),
    );
  });
});

describe('Navigation Id header is constant', () => {
  it('Uses same Navigation id for different calls', () => {
    const { [Header.NAVIGATION_ID]: firstNavigationId } = getHeaders(
      '/engine/apiv6/endpoint',
    );
    const { [Header.NAVIGATION_ID]: secondNavigationId } = getHeaders(
      '/engine/apiv6/another/endpoint',
    );

    expect(firstNavigationId).toEqual(secondNavigationId);
  });

  it('shares Navigation Id with top window', () => {
    const { top } = window;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.top;

    // define navigationId on top Window
    const parentNavigationId = 'parentId';
    window.top = {} as Window;
    window.top.ovhRequestTaggerNavigationId = parentNavigationId;

    const { [Header.NAVIGATION_ID]: navigationIdHeader } = getHeaders(
      '/engine/apiv6/endpoint',
    );

    expect(navigationIdHeader).toEqual(parentNavigationId);

    window.top = top;
  });
});

describe('Request Id header', () => {
  it('increments request id for each call', () => {
    const { [Header.REQUEST_ID]: firstRequestId } = getHeaders(
      '/engine/apiv6/endpoint',
    );
    const { [Header.REQUEST_ID]: secondRequestId } = getHeaders(
      '/engine/apiv6/another/endpoint',
    );
    expect(firstRequestId).toEqual(expect.stringMatching(/.*-1$/));
    expect(secondRequestId).toEqual(expect.stringMatching(/.*-2$/));
  });

  it('shares Request Id with top window', () => {
    const { top } = window;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.top;

    // define requestId on top Window
    window.top = {} as Window;
    window.top.ovhRequestTaggerRequestIndex = 5;

    const { [Header.REQUEST_ID]: requestIdHeader } = getHeaders(
      '/engine/apiv6/endpoint',
    );

    expect(requestIdHeader).toEqual(expect.stringMatching(/.*-6$/));

    window.top = top;
  });
});

describe('Page header definition', () => {
  it('defines page header by default', () => {
    const { [Header.PAGE]: pageHeader } = getHeaders('/engine/apiv6/endpoint');
    expect(pageHeader).toEqual('bootstrap');
  });

  it('updates page header', () => {
    const currentPage = 'awesome-page';
    defineCurrentPage(currentPage);
    const { [Header.PAGE]: pageHeader } = getHeaders('/engine/apiv6/endpoint');
    expect(pageHeader).toEqual(currentPage);
  });

  it('overwrites page header', () => {
    defineCurrentPage('awesome-page');

    const currentPage = 'home-page';
    defineCurrentPage(currentPage);
    const { [Header.PAGE]: pageHeader } = getHeaders('/engine/apiv6/endpoint');
    expect(pageHeader).toEqual(currentPage);
  });
});

describe('Version header definition', () => {
  it("doesn't return version header by default", () => {
    const headers = getHeaders('/engine/apiv6/endpoint');
    expect(headers).toEqual(expect.not.arrayContaining([Header.VERSION]));
  });

  it('retrieves the defined application version', () => {
    const applicationVersion = 'version-1234';
    defineApplicationVersion(applicationVersion);
    expect(getApplicationVersion()).toEqual(applicationVersion);
  });

  it('returns a version header when defined', () => {
    const applicationVersion = 'version-1234';
    defineApplicationVersion(applicationVersion);
    const { [Header.VERSION]: versionHeader } = getHeaders(
      '/engine/apiv6/endpoint',
    );
    expect(versionHeader).toEqual(applicationVersion);
  });
});

describe('Headers override', () => {
  afterEach(() => {
    const overrides = getHeadersOverride();
    Object.keys(overrides).forEach((pattern) => {
      removeHeadersOverride(pattern);
    });
  });

  it('overrides headers for specific calls', () => {
    defineApplicationVersion('default-version');
    defineCurrentPage('default-page');

    const secretVersion = 'secret-version';
    const secretPage = 'secret-page';
    addHeadersOverride('.*/secret$', {
      [Header.VERSION]: secretVersion,
      [Header.PAGE]: secretPage,
    });

    const {
      [Header.VERSION]: secretVersionHeader,
      [Header.PAGE]: secretPageHeader,
    } = getHeaders('/engine/apiv6/endpoint/secret');
    expect(secretVersionHeader).toEqual(secretVersion);
    expect(secretPageHeader).toEqual(secretPage);
  });

  it('allows to define multiple overrides headers', () => {
    defineApplicationVersion('default-version');
    defineCurrentPage('default-page');

    const secretVersion = 'secret-version';
    const secretPage = 'secret-page';
    const secretPattern = '.*/secret$';
    addHeadersOverride(secretPattern, {
      [Header.VERSION]: secretVersion,
      [Header.PAGE]: secretPage,
    });

    const commonPage = 'common';
    const commonPattern = '.*/common$';
    addHeadersOverride(commonPattern, {
      [Header.PAGE]: commonPage,
    });

    const headersOverrides = getHeadersOverride();
    expect(Object.keys(headersOverrides)).toEqual(
      expect.arrayContaining([secretPattern, commonPattern]),
    );

    expect(headersOverrides[secretPattern]).toMatchObject({
      [Header.VERSION]: secretVersion,
      [Header.PAGE]: secretPage,
    });

    expect(headersOverrides[commonPattern]).toMatchObject({
      [Header.PAGE]: commonPage,
    });
  });

  it("doesn't apply overrides headers on non-pattern calls", () => {
    const defaultApplicationVersion = 'default-version';
    const defaultCurrentPage = 'default-page';
    defineApplicationVersion(defaultApplicationVersion);
    defineCurrentPage(defaultCurrentPage);

    addHeadersOverride('.*/secret$', {
      [Header.VERSION]: 'secret-version',
      [Header.PAGE]: 'secret-page',
    });

    const {
      [Header.VERSION]: notSecretVersionHeader,
      [Header.PAGE]: notSecretPageHeader,
    } = getHeaders('/engine/apiv6/endpoint/not-secret');
    expect(notSecretVersionHeader).toEqual(defaultApplicationVersion);
    expect(notSecretPageHeader).toEqual(defaultCurrentPage);
  });

  it('allows to remove overriden headers', () => {
    const defaultApplicationVersion = 'default-version';
    const defaultCurrentPage = 'default-page';
    defineApplicationVersion(defaultApplicationVersion);
    defineCurrentPage(defaultCurrentPage);

    const secretPattern = '.*/secret$';
    addHeadersOverride(secretPattern, {
      [Header.VERSION]: 'secret-version',
      [Header.PAGE]: 'secret-page',
    });

    removeHeadersOverride(secretPattern);

    const {
      [Header.VERSION]: noMoreSecretVersionHeader,
      [Header.PAGE]: noMoreSecretPageHeader,
    } = getHeaders('/engine/apiv6/endpoint/secret');
    expect(noMoreSecretVersionHeader).toEqual(defaultApplicationVersion);
    expect(noMoreSecretPageHeader).toEqual(defaultCurrentPage);
  });

  it('allows to remove overriden headers without impacting other overrides', () => {
    const secretVersion = 'secret-version';
    const secretPage = 'secret-page';
    const secretPattern = '.*/secret$';
    addHeadersOverride(secretPattern, {
      [Header.VERSION]: secretVersion,
      [Header.PAGE]: secretPage,
    });

    const commonPage = 'common';
    const commonPattern = '.*/common$';
    addHeadersOverride(commonPattern, {
      [Header.PAGE]: commonPage,
    });

    removeHeadersOverride(secretPattern);
    const headersOverrides = getHeadersOverride();

    expect(Object.keys(headersOverrides)).toEqual(
      expect.arrayContaining([commonPattern]),
    );
    expect(Object.keys(headersOverrides)).toEqual(
      expect.not.arrayContaining([secretPattern]),
    );

    expect(headersOverrides[commonPattern]).toMatchObject({
      [Header.PAGE]: commonPage,
    });
  });

  it('does nothing if we want to remove non-defined overrides', () => {
    expect(Object.keys(getHeadersOverride())).toHaveLength(0);

    removeHeadersOverride('undefinedOverrides');

    expect(Object.keys(getHeadersOverride())).toHaveLength(0);

    addHeadersOverride('pattern', { [Header.PAGE]: 'patternPage' });

    expect(Object.keys(getHeadersOverride())).toHaveLength(1);
    expect(Object.keys(getHeadersOverride())).toEqual(
      expect.arrayContaining(['pattern']),
    );

    removeHeadersOverride('non-existing-pattern');

    expect(Object.keys(getHeadersOverride())).toHaveLength(1);
    expect(Object.keys(getHeadersOverride())).toEqual(
      expect.arrayContaining(['pattern']),
    );
  });
});
