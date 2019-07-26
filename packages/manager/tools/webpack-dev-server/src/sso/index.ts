/* eslint-disable no-console */
import assign from 'lodash/assign';
import base64url from 'base64url';
import cookie from 'cookie';
import proxy from 'request';

interface Config {
  host: string,
  baseUrl: string,
  devLoginUrl: string,
  proxy: {
    host: string,
  },
}

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

class Sso {
  config: Config;

  constructor(region) {
    this.config = CONFIG.ssoAuth[region];
  }

  login(req, res) {
    console.log('[SSO] - crosslogin');

    const { headers } = req;
    headers.host = this.config.host;

    const location = new Promise((resolve) => {
      proxy.get({
        url: this.config.baseUrl + req.url,
        headers,
        proxy: this.config.proxy ? this.config.proxy.host : '',
        followRedirect: false,
      }, (err, resp) => {
        if (err) {
          console.error('[SSO] - crosslogin - error: ', err);
          return resp.status(500);
        }

        const cookies = resp.headers['set-cookie'];

        cookies.reverse().forEach((someCookie) => {
          const parsedCookie = cookie.parse(someCookie);

          if (parsedCookie['CA.OVH.SES']) {
            res.cookie('CA.OVH.SES', parsedCookie['CA.OVH.SES'], { path: '/', httpOnly: true });
          }
          if (parsedCookie.SESSION) {
            res.cookie('SESSION', parsedCookie.SESSION, { path: '/', httpOnly: true });
          }
          if (parsedCookie.USERID) {
            res.cookie('USERID', parsedCookie.USERID, { path: '/' });
          }
        });

        console.log('[SSO] - Logged');

        return resolve(resp.headers.location);
      });
    });

    return res.redirect(location);
  }

  async auth(req:any, res:any) {
    const origin = req.headers.host;
    const protocol = req.protocol || 'http';
    const headers:Object = {
      contentType: 'application/json',
    };

    const redirectionUrl = await new Promise((resolve) => {
      proxy.post({
        url: this.config.devLoginUrl,
        proxy: this.config.proxy ? this.config.proxy.host : null,
        headers: assign(headers, { host: this.config.host }),
        followRedirect: false,
        gzip: true,
        json: {
          callbackUrl: `${protocol}://${origin}/auth/check`,
        },
      }, (err, resp, data) => {
        if (err) {
          return resp.status(500);
        }

        return resolve(data.data.url);
      });
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
            res.cookie('CA.OVH.SES', parsedCookie['CA.OVH.SES'], { path: '/', httpOnly: true });
          }

          if (parsedCookie.SESSION) {
            res.cookie('SESSION', parsedCookie.SESSION, { path: '/', httpOnly: true });
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
}

export = Sso;
/* eslint-enable no-console */
