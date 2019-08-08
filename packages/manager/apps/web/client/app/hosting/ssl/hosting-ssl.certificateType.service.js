angular.module('services').service(
  'hostingSSLCertificateType',
  class HostingSSLCertificateType {
    /**
     * Tests if a parameter is a non-empty string
     *
     * @static
     * @param   {string}       parameter
     * @throws  {TypeError} Only if the parameter is not a string or is empty
     */
    static testIsValidStringParameter(parameter) {
      if (!_(parameter).isString() || _(parameter).isEmpty()) {
        throw new TypeError('parameter should be a non-empty String');
      }
    }

    /**
     * @static
     * @returns {Object}    All the known certificate types
     */
    static getCertificateTypes() {
      /**
       * @typedef     {object}   CertificateType
       * @property    {string}   name             Name of the certificate
       * @property    {boolean}  isFree           True if the user had the certificate for free
       * @property    {string}   providerName     How was the certificate provided
       *  (either LETSENCRYPT for free certificates, COMODO for paid certificates or
       *  CUSTOM for imported certificates)
       */
      return {
        LETS_ENCRYPT: {
          name: 'letsEncrypt',
          isFree: true,
          providerName: 'LETSENCRYPT',
        },
        PAID: {
          name: 'paid',
          isFree: false,
          providerName: 'COMODO',
        },
        IMPORTED: {
          name: 'imported',
          isFree: true,
          providerName: 'CUSTOM',
        },
      };
    }

    /**
     * Checks if a mysteryCertificateType is a knownCertificateType
     *
     * @static
     * @param   {string}    mysteryCertificateType  Unknown certificate type
     * @param   {string}    knownCertificateType    Known certificate type to check against
     * @returns {boolean}   True if the mysteryCertificateType
     *  is the same as the knownCertificateType
     */
    static isCertificateType(mysteryCertificateType, knownCertificateType) {
      HostingSSLCertificateType.testIsValidStringParameter(mysteryCertificateType);
      HostingSSLCertificateType.testIsValidStringParameter(knownCertificateType);

      return (
        _(mysteryCertificateType)
          .snakeCase()
          .toUpperCase()
        === _(knownCertificateType)
          .snakeCase()
          .toUpperCase()
      );
    }

    /**
     * Checks if a certificate is a Let's Encrypt certificate
     *
     * @static
     * @param {string}      mysteryCertificateType  The type to check
     * @returns {boolean}   True if the certificate is a Let's Encrypt certificate
     */
    static isLetsEncrypt(mysteryCertificateType) {
      return HostingSSLCertificateType.isCertificateType(
        mysteryCertificateType,
        HostingSSLCertificateType.getCertificateTypes().LETS_ENCRYPT.name,
      );
    }

    /**
     * Checks if a certificate is a paid certificate
     *
     * @static
     * @param   {string}    mysteryCertificateType  The type to check
     * @returns {boolean}   True if the certificate is a paid certificate
     */
    static isPaid(mysteryCertificateType) {
      return HostingSSLCertificateType.isCertificateType(
        mysteryCertificateType,
        HostingSSLCertificateType.getCertificateTypes().PAID.name,
      );
    }

    /**
     * Checks if a certificate was imported by the user
     *
     * @static
     * @param   {string}    mysteryCertificateType  The type to check
     * @returns {boolean}   True if the certificate was imported
     */
    static isImported(mysteryCertificateType) {
      return HostingSSLCertificateType.isCertificateType(
        mysteryCertificateType,
        HostingSSLCertificateType.getCertificateTypes().IMPORTED.name,
      );
    }

    /**
     * @param   {string}            providerName    Name of the provider
     * @returns {CertificateType}   Matching certificate type
     */
    static getCertificateTypeByProvider(providerName) {
      HostingSSLCertificateType.testIsValidStringParameter(providerName);

      const formattedProviderName = _(providerName)
        .snakeCase()
        .toUpperCase();
      const matchingCertificate = _(HostingSSLCertificateType.getCertificateTypes())
        .find(certificateType => certificateType.providerName === formattedProviderName);

      const certificateIsFound = _(matchingCertificate).isObject();
      if (!certificateIsFound) {
        throw new Error(`${providerName} is not a valid provider name`);
      }

      return matchingCertificate;
    }
  },
);
