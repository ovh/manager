import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isFinite from 'lodash/isFinite';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';

angular.module('services').service(
  'DomainValidator',
  class DomainValidator {
    /**
     * Constructor
     * @param WucValidator
     */
    constructor(WucValidator) {
      this.WucValidator = WucValidator;

      this.regex = {
        TTL: /^\d+$/,
        DKIM: /^(?:\s*[vghknpst]\s*=\s*[^=;]*\s*(?:;\s*$|;|$))+/,
        DKIM_v: /^DKIM1$/,
        DKIM_g: /^[\w!#$%&"*+/=?^`{|}~.-]+$/,
        DKIM_h: /^(?:\*|sha1(?::sha256)?|sha256(?::sha1)?)$/,
        DKIM_k: /^rsa$/,
        DKIM_n: /^[^=;"]+$/,
        DKIM_p: /^(?:[A-Za-z0-9+/]{4})+(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
        DKIM_s: /^(?:\*|email)$/,
        DKIM_t: /^(?:y(?::s)?|s(?::y)?)$/,
        DMARC: /^(?:\s*(v|p|pct|rua|sp|aspf)\s*=\s*[^=;]*\s*(?:;\s*$|;|$))+/,
        DMARC_v: /^DMARC1$/,
        DMARC_p: /^none|quarantine|reject$/,
        DMARC_pct: /^0$|^\d\d?$|^100$/,
        DMARC_sp: /^$|none|quarantine|reject$/,
        DMARC_rua: /^([a-z][a-z0-9+.-]*):(?:\/\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\3)@)?(?=(\[[0-9A-F:.]{2,}\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\5(?::(?=(\d*))\6)?)(\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*))\8)?|(\/?(?!\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*))\10)?)(?:\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@/?]|%[0-9A-F]{2})*))\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@/?]|%[0-9A-F]{2})*))\12)?$/,
        DMARC_aspf: /^r|s$/,
        LOC: /^(\d+)\s+(?:|(\d+)\s+(?:(\d+(?:\.\d{1,3})?)\s+)?)(N|S)\s+(\d+)\s+(?:|(\d+)\s+(?:(\d+(?:\.\d{1,3})?)\s+)?)(E|W)\s+(-?(?:\d+)(?:\.\d{1,2})?)m(?:\s+(\d+(?:\.\d{1,2})?)m(?:\s+(\d+(?:\.\d{1,2})?)m(?:\s+(?:(\d+(?:\.\d{1,2})?)m)|)|))?$/,
        MX: /^(\d+)\s+(\S+)$/,
        NAPTR: /^(\d+)\s+(\d+)\s+"([A-Z0-9])"\s+"(\S+)"\s+"(?:(\S+)?)"\s?(\S*\.)$/,
        NAPTR_flag: /^[a-zA-Z0-9]?$/,
        NAPTR_service: /^(?:(?:[a-zA-Z0-9]+|[a-zA-Z0-9]+\+[a-zA-Z0-9]+(?!\+))(?::(?!$)|(?=$)))+$/,
        NAPTR_regex: /^[^"\s]+$/,
        NAPTR_replace: /^((?:[^.\s](?:\.(?!$))?)+)\.?$/,
        SPF: /^v=spf1\s*.*/,
        SPF_sender: {
          A: /^a(?:|(?::.+)|(?:\/\d+))$/,
          MX: /^mx(?:|(?::.+)|(?:\/\d+))$/,
          PTR: /^ptr(?:|(?::.+))$/,
          IP4: /^ip4:.+$/,
          IP6: /^ip6:.+$/,
          EXISTS: /^exists:.+$/,
          INCLUDE: /^include:.+$/,
          REDIRECT: /^redirect:.+$/,
          EXP: /^exp:.+$/,
        },
        SPF_all: /^[+?~-]all$/,
        SRV: /^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)$/,
        SRV_target: null,
        SSHFP: /^(1|2|3|4)\s+(1|2)\s+([a-zA-Z0-9]+)$/,
        SSHFP_fp1: /^(?:[a-zA-Z0-9]){40}$/,
        SSHFP_fp2: /^(?:[a-zA-Z0-9]){64}$/,
        TXT: /^"?([^"]+)"?$/,
        TLSA: /^(\d) (\d) (\d) ([a-z0-9]+)$/,
        CAA: /^(\d+)\s+(issue|issuewild|iodef)\s+"(\S+)"$/,
      };

      this.regex.SRV_target = this.regex.NAPTR_replace;

      /**
       * Special rules for SPF...
       */
      this.SPF = {
        isValidA: (_field) => {
          let field = _field;
          let isValid = true;

          if (/^a$/.test(field)) {
            // Format: "a"
            return true;
          }
          if (/^a\/([0-9]+)$/.test(field)) {
            // Format: "a/cidr"
            field = field.match(/^a\/([0-9]+)$/);
            if (field[1] < 1 || field[1] > 32) {
              isValid = false;
            }
          } else if (/^a:.+/.test(field)) {
            field = field.replace(/^(a:)/, '');
            if (field.indexOf('/') !== -1) {
              // Format: "a:domain/cidr"
              field = field.split('/');
              if (
                !isFinite(field[1]) ||
                field[1] < 1 ||
                field[1] > 32 ||
                !this.WucValidator.isValidDomain(field[0], {
                  canBeginWithUnderscore: true,
                })
              ) {
                isValid = false;
              }
            } else if (
              !this.WucValidator.isValidDomain(field, {
                canBeginWithUnderscore: true,
              })
            ) {
              // Format: "a:domain"
              isValid = false;
            }
          } else {
            isValid = false;
          }
          return isValid;
        },
        isValidMX: (_field) => {
          let field = _field;
          let isValid = true;

          if (/^mx$/.test(field)) {
            // Format: "mx"
            return true;
          }
          if (/^mx\/([0-9]+)$/.test(field)) {
            // Format: "mx/cidr"
            field = field.match(/^mx\/([0-9]+)$/);
            if (field[1] < 1 || field[1] > 32) {
              isValid = false;
            }
          } else if (/^mx:.+/.test(field)) {
            field = field.replace(/^(mx:)/, '');
            if (field.indexOf('/') !== -1) {
              // Format: "mx:domain/cidr"
              field = field.split('/');
              if (
                !isFinite(field[1]) ||
                field[1] < 1 ||
                field[1] > 32 ||
                !this.WucValidator.isValidDomain(field[0], {
                  canBeginWithUnderscore: true,
                })
              ) {
                isValid = false;
              }
            } else if (
              !this.WucValidator.isValidDomain(field, {
                canBeginWithUnderscore: true,
              })
            ) {
              // Format: "mx:domain"
              isValid = false;
            }
          } else {
            isValid = false;
          }

          return isValid;
        },
        isValidPTR: (_field) => {
          let field = _field;
          let isValid = true;

          if (/^ptr$/.test(field)) {
            // Format: "ptr"
            return true;
          }
          if (/^ptr:.+/.test(field)) {
            field = field.replace(/^(ptr:)/, '');
            if (
              !this.WucValidator.isValidDomain(field, {
                canBeginWithUnderscore: true,
              })
            ) {
              // Format: "ptr:domain"
              isValid = false;
            }
          } else {
            isValid = false;
          }

          return isValid;
        },
        isValidIP4: (_field) => {
          let field = _field;
          let isValid = true;

          if (/^ip4:.+/.test(field)) {
            field = field.replace(/^(ip4:)/, '');
            if (field.indexOf('/') !== -1) {
              // Format: "ip4:ipv4/cidr"
              const [ip, cidrAsString] = field.split('/');

              const cidrIsValid = /^\d+$/.test(cidrAsString);

              if (!cidrIsValid) {
                return false;
              }

              const cidr = parseInt(cidrAsString.match(/^\d+$/)[0], 10);

              if (
                !isFinite(cidr) ||
                cidr < 1 ||
                cidr > 32 ||
                !this.WucValidator.isValidIpv4(ip)
              ) {
                isValid = false;
              }
            } else if (!this.WucValidator.isValidIpv4(field)) {
              // Format: "ip4:ipv4"
              isValid = false;
            }
          } else {
            isValid = false;
          }

          return isValid;
        },
        isValidIP6: (_field) => {
          let field = _field;
          let isValid = true;

          if (/^ip6:.+/.test(field)) {
            field = field.replace(/^(ip6:)/, '');
            if (field.indexOf('/') !== -1) {
              // Format: "ip6:ipv6/cidr"
              const [ip, cidrAsString] = field.split('/');

              const cidrIsValid = /^\d+$/.test(cidrAsString);

              if (!cidrIsValid) {
                return false;
              }

              const cidr = parseInt(cidrAsString.match(/^\d+$/)[0], 10);

              if (
                !isFinite(cidr) ||
                cidr < 1 ||
                cidr > 128 ||
                !this.WucValidator.isValidIpv6(ip)
              ) {
                isValid = false;
              }
            } else if (!this.WucValidator.isValidIpv6(field)) {
              // Format: "ip6:ipv6"
              isValid = false;
            }
          } else {
            isValid = false;
          }

          return isValid;
        },

        // HELPER only
        isValidEXISTSorINCLUDEorREDIRECTorEXP: (type, _field) => {
          let field = _field;
          let isValid = true;

          if (new RegExp(`^${type}:.+`).test(field)) {
            field = field.replace(new RegExp(`^(${type}:)`), '');
            if (
              !this.WucValidator.isValidDomain(field, {
                canBeginWithUnderscore: true,
              })
            ) {
              // Format: "type:domain"
              isValid = false;
            }
          } else {
            isValid = false;
          }

          return isValid;
        },
        isValidEXIST: (field) =>
          this.SPF.isValidEXISTSorINCLUDEorREDIRECTorEXP('exists', field),
        isValidINCLUDE: (field) =>
          this.SPF.isValidEXISTSorINCLUDEorREDIRECTorEXP('include', field),
        isValidREDIRECT: (field) =>
          this.SPF.isValidEXISTSorINCLUDEorREDIRECTorEXP('redirect', field),
        isValidEXP: (field) =>
          this.SPF.isValidEXISTSorINCLUDEorREDIRECTorEXP('exp', field),
      };
    }

    /**
     * Validate TTL
     * @param {string} ttl
     * @returns {boolean}
     */
    isValidTtl(_ttl) {
      let ttl = _ttl;

      if (!this.regex.TTL.test(ttl)) {
        return false;
      }

      ttl = parseInt(ttl, 10);
      return isFinite(ttl) && (ttl === 0 || (ttl >= 60 && ttl <= 2147483647));
    }

    /**
     * Validate Tlsa
     * @param {string} target
     * @returns {boolean}
     */
    isValidTlsa(target) {
      const splitted = target.match(this.regex.TLSA);

      if (splitted !== null && splitted.length === 5) {
        const usage = splitted[1];
        const selector = splitted[2];
        const matchingType = splitted[3];
        const certificateData = splitted[4];
        if (usage < 0 || usage > 3) {
          return false;
        }
        if (selector !== '0' && selector !== '1') {
          return false;
        }
        if (matchingType !== '1' && matchingType !== '2') {
          return false;
        }
        if (matchingType === '1' && certificateData.length !== 64) {
          return false;
        }
        if (matchingType === '2' && certificateData.length !== 128) {
          return false;
        }
        return true;
      }
      return false;
    }

    /**
     * Check if MX target is valid
     * @param {string} value
     * @returns {boolean}
     */
    isValidMXTarget(value) {
      if (/\s+\.$/.test(value)) {
        // prevent spaces before dot
        return false;
      }
      if (/(.+)\.$/.test(value)) {
        return this.WucValidator.isValidDomain(value.match(/(.+)\.$/)[1]);
      }
      return this.WucValidator.isValidSubDomain(value);
    }

    /**
     * Check if NAPTR replace field is valid
     * @param {string} value
     * @returns {boolean}
     */
    isValidReplaceNaptr(value) {
      if (value === '.') {
        return true;
      }
      if (this.regex.NAPTR_replace.test(value)) {
        return this.WucValidator.isValidDomain(
          value.match(this.regex.NAPTR_replace)[1],
          { canBeginWithUnderscore: true },
        );
      }
      return this.WucValidator.isValidDomain(value);
    }

    /**
     * Validate a target field
     * @param {string} target
     * @param {string} fieldType
     * @returns {boolean}
     */
    isValidTarget(target, fieldType) {
      let isValid = true;
      let splitted;

      switch (fieldType) {
        case 'A':
        case 'DYNHOST':
          return this.WucValidator.isValidIpv4(target);
        case 'AAAA':
          return this.WucValidator.isValidIpv6(target);
        case 'NS':
        case 'CNAME':
          if (/\s+\.$/.test(target)) {
            // prevent spaces before dot
            return false;
          }
          if (/(.+)\.$/.test(target)) {
            return this.WucValidator.isValidDomain(target.match(/(.+)\.$/)[1], {
              canBeginWithUnderscore: true,
              canContainsUnderscore: true,
            });
          }
          return this.WucValidator.isValidSubDomain(target, {
            canBeginWithUnderscore: true,
            canContainsUnderscore: true,
          });
        case 'TXT':
          return this.regex.TXT.test(target);
        case 'DKIM':
        case 'DMARC':
          if (!this.regex[fieldType].test(target)) {
            isValid = false;
            break;
          }
          splitted = split(target.replace(/(;)$/, ''), ';');
          if (!isEmpty(splitted)) {
            for (let i = 0; i < splitted.length; i += 1) {
              const splittedVal = splitted[i].trim().split('=');

              if (
                !this.regex[`${fieldType}_${splittedVal[0]}`] ||
                !this.regex[`${fieldType}_${splittedVal[0]}`].test(
                  splittedVal[1],
                )
              ) {
                isValid = false;
                break;
              }
            }
          }
          break;
        case 'LOC':
          splitted = target.match(this.regex.LOC);
          if (splitted && splitted.length > 1) {
            forEach([1, 2, 5, 6], (k) => {
              splitted[k] = parseInt(splitted[k], 10);
            });
            forEach([3, 7, 9, 10, 11, 12], (k) => {
              splitted[k] = parseFloat(splitted[k]);
            });

            if (
              splitted[1] < 0 ||
              splitted[1] > 90 || // d1
              (splitted[2] && (splitted[2] < 0 || splitted[2] > 59)) || // m1
              (splitted[3] && (splitted[3] < 0 || splitted[3] > 59.999)) || // s1
              splitted[5] < 0 ||
              splitted[5] > 180 || // d2
              (splitted[6] && (splitted[6] < 0 || splitted[6] > 59)) || // m2
              (splitted[7] && (splitted[7] < 0 || splitted[7] > 59.999)) || // s2
              splitted[9] < -100000 ||
              splitted[9] > 42849672.95 || // alt
              (splitted[10] && (splitted[10] < 0 || splitted[10] > 90000000)) || // size
              (splitted[11] && (splitted[11] < 0 || splitted[11] > 90000000)) || // hp
              (splitted[12] && (splitted[12] < 0 || splitted[12] > 90000000))
            ) {
              // vp
              isValid = false;
              break;
            }
          } else {
            isValid = false;
          }
          break;
        case 'MX':
          splitted = target.match(this.regex.MX);
          if (splitted && splitted.length > 1) {
            // Validate priority
            splitted[1] = parseInt(splitted[1], 10);
            if (splitted[1] < 0 || splitted[1] > 65535) {
              isValid = false;
              break;
            }

            // Validate target
            isValid = this.isValidMXTarget(splitted[2]);
          } else {
            isValid = false;
          }
          break;
        case 'NAPTR':
          splitted = target.match(this.regex.NAPTR); // TODO: exclude dot!
          if (splitted && splitted.length > 1) {
            splitted[1] = parseInt(splitted[1], 10);
            splitted[2] = parseInt(splitted[2], 10);

            // order || pref || services
            if (
              splitted[1] < 0 ||
              splitted[1] > 65535 ||
              splitted[2] < 0 ||
              splitted[2] > 65535 ||
              !this.regex.NAPTR_service.test(splitted[4])
            ) {
              isValid = false;
              break;
            }

            // replace must be "."
            if (
              splitted[5] &&
              (!this.regex.NAPTR_regex.test(splitted[5]) || splitted[6] !== '.')
            ) {
              isValid = false;
              break;
            }

            // Validate replace
            if (splitted[6]) {
              isValid = this.isValidReplaceNaptr(splitted[6]);
            } else {
              isValid = false;
            }

            if (!isValid) {
              break;
            }
          } else {
            isValid = false;
          }
          break;
        case 'SPF':
          if (!this.regex.SPF.test(target)) {
            isValid = false;
            break;
          }
          splitted = target
            .replace(/\s{2,}/g, ' ')
            .replace(/^"(.*)"$/, '$1')
            .trim()
            .split(/\s/);

          if (splitted && splitted.length > 2) {
            let found = false;

            // Begin at "i = 1" because exclude first field (v=spf1)
            for (let i = 1; i < splitted.length; i += 1) {
              found = false;

              // Test "a", "mx", "ptr", "ip4", "ip6", "include", "exists", "redirect", "exp" fields
              const fieldTypes = [
                'A',
                'MX',
                'PTR',
                'IP4',
                'IP6',
                'INCLUDE',
                'EXISTS',
                'REDIRECT',
                'EXP',
              ];

              for (let j = 0; j < fieldTypes.length; j += 1) {
                const currentFieldType = fieldTypes[j];

                if (
                  !found &&
                  this.regex.SPF_sender[currentFieldType].test(splitted[i])
                ) {
                  found = true;

                  if (!this.SPF[`isValid${currentFieldType}`](splitted[i])) {
                    isValid = false;
                  }
                }
              }

              if (!isValid) {
                break;
              }

              // Test "all": it"s the only last possible field
              if (!found && !this.regex.SPF_all.test(splitted[i])) {
                isValid = false;
                break;
              }
            }
          }
          break;
        case 'SRV':
          splitted = target.match(this.regex.SRV); // TODO: exclude dot!
          if (splitted && splitted.length > 1) {
            splitted[1] = parseInt(splitted[1], 10);
            splitted[2] = parseInt(splitted[2], 10);
            splitted[3] = parseInt(splitted[3], 10);

            // priority || weight || port
            if (
              splitted[1] < 0 ||
              splitted[1] > 65535 ||
              splitted[2] < 0 ||
              splitted[2] > 65535 ||
              splitted[3] < 0 ||
              splitted[3] > 65535
            ) {
              isValid = false;
              break;
            }

            // Validate target
            if (/\s+\.$/.test(splitted[4])) {
              // prevent spaces before dot
              isValid = false;
            } else if (/(.+)\.$/.test(splitted[4])) {
              isValid = this.WucValidator.isValidDomain(
                splitted[4].match(/(.+)\.$/)[1],
              );
            } else {
              isValid = false;
            }
          } else {
            isValid = false;
          }
          break;
        case 'SSHFP':
          splitted = target.match(this.regex.SSHFP);
          if (splitted && splitted.length > 1) {
            // (SHA-1 : length 40) || (SHA-256 : length 64)
            if (
              (+splitted[2] === 1 && !this.regex.SSHFP_fp1.test(splitted[3])) ||
              (+splitted[2] === 2 && !this.regex.SSHFP_fp2.test(splitted[3]))
            ) {
              isValid = false;
              break;
            }
          } else {
            isValid = false;
          }
          break;
        case 'TLSA':
          isValid = this.isValidTlsa(target);
          break;
        default:
          break;
      }

      return isValid;
    }

    /**
     * Convert target host field unicode <-> punycode
     * @param action
     * @param fieldType
     * @param target
     */
    getConvertedTarget(action, fieldType, target) {
      let splitted;

      switch (fieldType) {
        case 'NS':
        case 'CNAME':
          return punycode[action](target);
        case 'MX':
          splitted = target.match(this.regex.MX);
          if (splitted && splitted.length && splitted[2]) {
            splitted[2] = punycode[action](splitted[2]);
          }
          break;
        case 'NAPTR':
          splitted = target.match(this.regex.NAPTR); // TODO: exclude dot!
          if (splitted && splitted.length && splitted[6]) {
            splitted[6] = punycode[action](splitted[6]);
          }
          break;
        case 'SRV':
          splitted = target.match(this.regex.SRV);
          if (splitted && splitted.length && splitted[4]) {
            splitted[4] = punycode[action](splitted[4]);
          }
          break;
        default:
          return target;
      }

      if (splitted) {
        splitted.shift();
        return splitted
          .join(' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
      }
      return target;
    }

    /**
     * Convert target to Unicode
     * @param fieldType
     * @param target
     */
    convertTargetToUnicode(fieldType, target) {
      return this.getConvertedTarget('toUnicode', fieldType, target);
    }

    /**
     * Convert target to ASCII
     * @param fieldType
     * @param target
     */
    convertTargetToPunycode(fieldType, target) {
      return this.getConvertedTarget('toASCII', fieldType, target);
    }

    /**
     * Transform DKIM target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformDKIMTarget(target) {
      const hash = keys(pickBy(get(target, 'h'), (val) => !!val));
      const flags = keys(pickBy(get(target, 't'), (val) => !!val));
      const pRevoke = get(target, 'pRevoke', false);
      let value = '';

      value += get(target, 'v.DKIM1', false) ? 'v=DKIM1;' : ''; // Version
      value += get(target, 'g', false) ? `g=${target.g};` : ''; // Granularity
      value += !isEmpty(hash) ? `h=${hash.join(':')};` : ''; // Hash algorithm
      value += get(target, 'k.rsa', false) ? 'k=rsa;' : ''; // Keytype
      value += get(target, 'n', false) ? `n=${target.n};` : ''; // Notes
      value += get(target, 's', false) ? `s=${target.s};` : ''; // Service type
      value +=
        get(target, 'publicKey', false) && !pRevoke
          ? `p=${target.publicKey};`
          : '';
      value += pRevoke ? 'p=;' : '';
      value += !isEmpty(flags) ? `t=${flags.join(':')};` : ''; // Flags

      return value;
    }

    /**
     * Transform DMARC target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformDMARCTarget(target) {
      let value = 'v=DMARC1;'; // Version
      value += get(target, 'p', false) ? `p=${target.p};` : ''; // Domain Policy
      value += get(target, 'pct', false) ? `pct=${target.pct};` : ''; // Percent
      value += get(target, 'rua', false) ? `rua=${target.rua};` : ''; // Addresses to send feedback
      value += get(target, 'sp', false) ? `sp=${target.sp};` : ''; // SubDomain Policy
      value += get(target, 'aspf', false) ? `aspf=${target.aspf};` : ''; // SPF Alignment Mode

      return value;
    }

    /**
     * Transform LOC target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformLOCTarget(target) {
      return [
        get(target, 'lat_deg', false) ? target.lat_deg.toString() : '',
        get(target, 'lat_min', false) ? target.lat_min.toString() : '',
        get(target, 'lat_sec', false) ? target.lat_sec.toString() : '',
        get(target, 'latitude', false) ? target.latitude.toString() : '',
        get(target, 'long_deg', false) ? target.long_deg.toString() : '',
        get(target, 'long_min', false) ? target.long_min.toString() : '',
        get(target, 'long_sec', false) ? target.long_sec.toString() : '',
        get(target, 'longitude', false) ? target.longitude.toString() : '',
        get(target, 'altitude', false) ? `${target.altitude.toString()}m` : '',
        get(target, 'size', false) ? `${target.size.toString()}m` : '',
        get(target, 'hp', false) ? `${target.hp.toString()}m` : '',
        get(target, 'vp', false) ? `${target.vp.toString()}m` : '',
      ]
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    /**
     * Transform MX target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformMXTarget(target) {
      return [
        target.priority != null ? target.priority.toString() : '',
        get(target, 'target', false) ? punycode.toASCII(target.target) : '',
      ]
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    /**
     * Transform NAPTR target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformNAPTRTarget(target) {
      let lastItem = '.';

      if (target.replace) {
        lastItem = /\.$/.test(target.replace)
          ? punycode.toASCII(target.replace)
          : `${punycode.toASCII(target.replace)}.`;
      }

      return [
        get(target, 'order', false) ? target.order.toString() : '',
        get(target, 'pref', false) ? target.pref.toString() : '',
        `"${get(target, 'flag', false) ? target.flag.toUpperCase() : ''}"`,
        `"${target.service || ''}"`,
        `"${target.regex || ''}"`,
        lastItem,
      ]
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    /**
     * Get the formatted string by field type
     * @param {string} value
     * @param {string} fieldType
     */
    static getSpfFieldFormatted(value, fieldType) {
      let fieldFormatted;
      switch (fieldType) {
        case 'a':
        case 'mx':
        case 'ptr':
          fieldFormatted = new RegExp(`^${fieldType}[/:].+`).test(value)
            ? value
            : `${fieldType}:${value}`;
          break;
        default:
          fieldFormatted = new RegExp(`^${fieldType}:.+`).test(value)
            ? value
            : `${fieldType}:${value}`;
      }
      return fieldFormatted;
    }

    /**
     * Transform SPF target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformSPFTarget(target) {
      let value = 'v=spf1';
      value += get(target, 'aSender', false) ? ' a' : '';
      value += get(target, 'mxSender', false) ? ' mx' : '';
      value += get(target, 'ptrSender', false) ? ' ptr' : '';

      forEach(['a', 'mx', 'ptr', 'ip4', 'ip6', 'include'], (fieldType) => {
        if (get(target, fieldType, false)) {
          const splitted = target[fieldType]
            .replace(/\s{2,}/g, ' ')
            .split(/\s/);
          for (let i = 0; i < splitted.length; i += 1) {
            const fieldFormatted = this.getSpfFieldFormatted(
              splitted[i],
              fieldType,
            );
            value += ` ${fieldFormatted}`;
          }
        }
      });

      value += get(target, 'all', false) ? ` ${target.all}` : '';

      return value;
    }

    /**
     * Transform SRV target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformSRVTarget(target) {
      let lastItem = '.';

      if (target.target) {
        lastItem = /\.$/.test(target.target)
          ? punycode.toASCII(target.target)
          : `${punycode.toASCII(target.target)}.`;
      }

      return [
        target.priority != null ? target.priority.toString() : '',
        target.weight != null ? target.weight.toString() : '',
        target.port != null ? target.port.toString() : '',
        lastItem,
      ]
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    /**
     * Transform SSHFP target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformSSHFPTarget(target) {
      return [target.algorithm || '', target.fptype || '', target.fp || '']
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    /**
     * Transform TLSA target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformTLSATarget(target) {
      if (
        has(target, 'usage') &&
        parseInt(target.usage, 10) >= 0 &&
        has(target, 'selector') &&
        parseInt(target.selector, 10) >= 0 &&
        has(target, 'matchingType') &&
        parseInt(target.matchingType, 10) > 0 &&
        has(target, 'certificateData') &&
        target.certificateData !== ''
      ) {
        return [
          target.usage.toString(),
          target.selector.toString(),
          target.matchingType.toString(),
          target.certificateData.toString(),
        ]
          .join(' ')
          .trim();
      }
      return '';
    }

    /**
     * Transform CAA target to expected value
     * @param {object} target
     * @returns {string}
     */
    static transformCAATarget(target) {
      const isValidFlags =
        has(target, 'flags') &&
        isFinite(target.flags) &&
        target.flags >= 0 &&
        target.flags < 256;

      if (isValidFlags) {
        const { flags } = target;
        const tag = get(target, 'tag', false) ? target.tag.toString() : '';
        const caaTarget = get(target, 'target', false)
          ? target.target.toString()
          : '';
        return `${flags} ${tag} "${caaTarget}"`;
      }
      return '';
    }

    /**
     * Convert host to unicode
     * @param {string} host
     * @returns {string}
     */
    static convertHostToUnicode(host) {
      return punycode.toUnicode(host);
    }
  },
);
