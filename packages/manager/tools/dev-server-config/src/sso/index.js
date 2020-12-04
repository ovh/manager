/* eslint-disable no-console */
const base64url = require('base64url');
const cookie = require('cookie');
const proxy = require('request');

const CONFIG = {
  ssoAuth: {
    eu: {
      host: 'www.ovh.com',
      baseUrl: 'https://www.ovh.com/cgi-bin/crosslogin.cgi',
      devLoginUrl: 'https://www.ovh.com/auth/requestDevLogin/',
    },
    ca: {
      host: 'ca.ovh.com',
      devLoginUrl: 'https://ca.ovh.com/auth/requestDevLogin/',
      baseUrl: 'https://ca.ovh.com/cgi-bin/crosslogin.cgi',
    },
    us: {
      host: 'us.ovhcloud.com',
      devLoginUrl: 'https://us.ovhcloud.com/auth/requestDevLogin/',
      baseUrl: 'https://us.ovhcloud.com/cgi-bin/crosslogin.cgi',
    },
  },
};

module.exports = class Sso {
  config;

  constructor(region) {
    this.config = CONFIG.ssoAuth[region.toLowerCase()];
  }

  login(req, res) {
    console.log('[SSO] - crosslogin');

    const { headers } = req;
    headers.host = this.config.host;

    const location = new Promise((resolve) => {
      proxy.get(
        {
          url: this.config.baseUrl + req.url,
          headers,
          proxy: this.config.proxy ? this.config.proxy.host : '',
          followRedirect: false,
        },
        (err, resp) => {
          if (err) {
            console.error('[SSO] - crosslogin - error: ', err);
            return resp.status(500);
          }

          const cookies = resp.headers['set-cookie'];

          cookies.reverse().forEach((someCookie) => {
            const parsedCookie = cookie.parse(someCookie);

            if (parsedCookie['CA.OVH.SES']) {
              res.cookie('CA.OVH.SES', parsedCookie['CA.OVH.SES'], {
                path: '/',
                httpOnly: true,
              });
            }
            if (parsedCookie.SESSION) {
              res.cookie('SESSION', parsedCookie.SESSION, {
                path: '/',
                httpOnly: true,
              });
            }
            if (parsedCookie.USERID) {
              res.cookie('USERID', parsedCookie.USERID, { path: '/' });
            }
          });

          console.log('[SSO] - Logged');

          return resolve(resp.headers.location);
        },
      );
    });

    return res.redirect(location);
  }

  async auth(req, res) {
    const origin = req.headers.host;
    const protocol = req.protocol || 'http';
    const headers = {
      contentType: 'application/json',
    };

    const redirectionUrl = await new Promise((resolve) => {
      proxy.post(
        {
          url: this.config.devLoginUrl,
          proxy: this.config.proxy ? this.config.proxy.host : null,
          headers: {
            ...headers,
            host: this.config.host,
          },
          followRedirect: false,
          gzip: true,
          json: {
            callbackUrl: `${protocol}://${origin}/auth/check`,
          },
        },
        (err, resp, data) => {
          if (err) {
            return resp.status(500);
          }

          return resolve(data.data.url);
        },
      );
    });

    res.redirect(redirectionUrl);
  }

  checkAuth(req, res) {
    const { headers } = req;
    headers.host = this.config.host;

    try {
      const cookies = JSON.parse(base64url.decode(req.query.data));

      if (Array.isArray(cookies.cookies)) {
        cookies.cookies.forEach((c) => {
          const parsedCookie = cookie.parse(c);

          if (parsedCookie['CA.OVH.SES']) {
            res.cookie('CA.OVH.SES', parsedCookie['CA.OVH.SES'], {
              path: '/',
              httpOnly: true,
            });
          }

          if (parsedCookie.SESSION) {
            res.cookie('SESSION', parsedCookie.SESSION, {
              path: '/',
              httpOnly: true,
            });
          }
          if (parsedCookie.USERID) {
            res.cookie('USERID', parsedCookie.USERID, { path: '/' });
          }
        });
      }
    } catch (err) {
      console.error(err);
    }

    res.redirect('/');
  }
};

/* eslint-enable no-console */
