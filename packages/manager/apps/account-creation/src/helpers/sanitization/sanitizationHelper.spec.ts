import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from './sanitizationHelper';

describe('sanitizeUrl', () => {
  describe('Valid URLs', () => {
    describe('HTTPS URLs', () => {
      it('should accept valid OVH HTTPS URL', () => {
        const url = 'https://www.ovh.com/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid OVHcloud HTTPS URL', () => {
        const url = 'https://www.ovhcloud.com/en/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid OVH Telecom HTTPS URL', () => {
        const url = 'https://www.ovhtelecom.fr/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid OVH Hosting HTTPS URL', () => {
        const url = 'https://www.ovh-hosting.fi/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid SoYouStart HTTPS URL', () => {
        const url = 'https://www.soyoustart.com/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid Kimsufi HTTPS URL', () => {
        const url = 'https://www.kimsufi.com/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid build-ovh HTTPS URL', () => {
        const url = 'https://www.build-ovh.com/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept valid build-ovhcloud HTTPS URL', () => {
        const url = 'https://www.build-ovhcloud.com/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with subdomain', () => {
        const url = 'https://api.ovh.com/console';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with multiple subdomains', () => {
        const url = 'https://api.manager.ovh.com/console';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with port', () => {
        const url = 'https://www.ovh.com:8080/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with path', () => {
        const url = 'https://www.ovh.com/manager/web/configuration';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with query parameters', () => {
        const url = 'https://www.ovh.com/manager?param=value';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept OVH URL with hash', () => {
        const url = 'https://www.ovh.com/manager#section';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('Different TLDs', () => {
      it('should accept ovh.net domain', () => {
        const url = 'https://www.ovh.net/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.org domain', () => {
        const url = 'https://www.ovh.org/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.ovh domain', () => {
        const url = 'https://www.ovh.ovh/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.co.uk domain', () => {
        const url = 'https://www.ovh.co.uk/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.com.tn domain', () => {
        const url = 'https://www.ovh.com.tn/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.cz domain', () => {
        const url = 'https://www.ovh.cz/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.de domain', () => {
        const url = 'https://www.ovh.de/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.es domain', () => {
        const url = 'https://www.ovh.es/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.eu domain', () => {
        const url = 'https://www.ovh.eu/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.fi domain', () => {
        const url = 'https://www.ovh.fi/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.fr domain', () => {
        const url = 'https://www.ovh.fr/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.ie domain', () => {
        const url = 'https://www.ovh.ie/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.it domain', () => {
        const url = 'https://www.ovh.it/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.lt domain', () => {
        const url = 'https://www.ovh.lt/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.ma domain', () => {
        const url = 'https://www.ovh.ma/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.nl domain', () => {
        const url = 'https://www.ovh.nl/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.pl domain', () => {
        const url = 'https://www.ovh.pl/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.pt domain', () => {
        const url = 'https://www.ovh.pt/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.sn domain', () => {
        const url = 'https://www.ovh.sn/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.uk domain', () => {
        const url = 'https://www.ovh.uk/';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept ovh.us domain', () => {
        const url = 'https://www.ovh.us/';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('HTTP URLs', () => {
      it('should accept valid OVH HTTP URL', () => {
        const url = 'http://www.ovh.com/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept HTTP URL with port', () => {
        const url = 'http://www.ovh.com:8080/';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('FTP URLs', () => {
      it('should accept valid OVH FTP URL', () => {
        const url = 'ftp://ftp.ovh.com/files';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept FTP URL with port', () => {
        const url = 'ftp://ftp.ovh.com:21/files';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('File URLs', () => {
      it('should accept valid OVH file URL', () => {
        const url = 'file://www.ovh.com/path/to/file';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('Blob URLs', () => {
      it('should accept valid OVH blob URL', () => {
        const url = 'blob://www.ovh.com/blob-id';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('Localhost URLs', () => {
      it('should accept localhost HTTPS URL', () => {
        const url = 'https://localhost/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept localhost HTTP URL', () => {
        const url = 'http://localhost/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept localhost with port', () => {
        const url = 'https://localhost:3000/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept localhost with path and query', () => {
        const url = 'http://localhost:8080/api?test=true';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('127.0.0.1 URLs', () => {
      it('should accept 127.0.0.1 HTTPS URL', () => {
        const url = 'https://127.0.0.1/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept 127.0.0.1 HTTP URL', () => {
        const url = 'http://127.0.0.1/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept 127.0.0.1 with port', () => {
        const url = 'https://127.0.0.1:3000/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept 127.0.0.1 with path and query', () => {
        const url = 'http://127.0.0.1:8080/api?test=true';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('Data URLs', () => {
      it('should accept data:image URL', () => {
        const url =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept data:image/jpeg URL', () => {
        const url = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept data:image/svg+xml URL', () => {
        const url =
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    describe('URLs with leading/trailing whitespace', () => {
      it('should accept URL with leading whitespace', () => {
        const url = '   https://www.ovh.com/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept URL with trailing whitespace', () => {
        const url = 'https://www.ovh.com/manager   ';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept URL with leading and trailing whitespace', () => {
        const url = '   https://www.ovh.com/manager   ';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept URL with tabs', () => {
        const url = '\t\thttps://www.ovh.com/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });

      it('should accept URL with newlines', () => {
        const url = '\n\nhttps://www.ovh.com/manager';
        expect(sanitizeUrl(url)).toBe(url);
      });
    });
  });

  describe('Invalid URLs', () => {
    it('should reject null', () => {
      expect(sanitizeUrl(null)).toBeNull();
    });

    it('should reject empty string', () => {
      expect(sanitizeUrl('')).toBeNull();
    });

    it('should reject URL without protocol', () => {
      const url = 'www.ovh.com/manager';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject non-OVH domain', () => {
      const url = 'https://www.google.com/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject non-OVH domain with similar name', () => {
      const url = 'https://www.ovhfake.com/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject URL with invalid protocol', () => {
      // eslint-disable-next-line no-script-url
      const url = 'javascript:alert("xss")';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject data URL that is not an image', () => {
      const url = 'data:text/html,<script>alert("xss")</script>';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject URL with unsupported TLD', () => {
      const url = 'https://www.ovh.xyz/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject ovhcloud with non-.com TLD', () => {
      const url = 'https://www.ovhcloud.net/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject ovhtelecom with non-.fr TLD', () => {
      const url = 'https://www.ovhtelecom.com/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject ovh-hosting with non-.fi TLD', () => {
      const url = 'https://www.ovh-hosting.com/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject URL with only whitespace', () => {
      const url = '   ';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject malformed URL', () => {
      const url = 'https://';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject relative URL', () => {
      const url = '/manager/dashboard';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject protocol-relative URL', () => {
      const url = '//www.ovh.com/manager';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject localhost on different IP', () => {
      const url = 'https://192.168.1.1/manager';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject URL with @ symbol (potential phishing)', () => {
      const url = 'https://attacker.com@ovh.com/';
      expect(sanitizeUrl(url)).toBeNull();
    });

    it('should reject plain text', () => {
      const url = 'just some text';
      expect(sanitizeUrl(url)).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle URL with only protocol and domain', () => {
      const url = 'https://ovh.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle URL with trailing slash', () => {
      const url = 'https://www.ovh.com/';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle URL without trailing slash', () => {
      const url = 'https://www.ovh.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle URL with complex path', () => {
      const url =
        'https://www.ovh.com/manager/web/configuration/domain/example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle URL with multiple query parameters', () => {
      const url =
        'https://www.ovh.com/manager?param1=value1&param2=value2&param3=value3';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle URL with encoded characters', () => {
      const url = 'https://www.ovh.com/manager?search=hello%20world';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle case insensitivity of protocol', () => {
      const url = 'HTTPS://www.ovh.com/manager';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle case insensitivity of domain', () => {
      const url = 'https://WWW.OVH.COM/manager';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle mixed case URL', () => {
      const url = 'HtTpS://WwW.OvH.CoM/MaNaGeR';
      expect(sanitizeUrl(url)).toBe(url);
    });
  });
});
