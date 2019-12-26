/* global before, it, describe */

const _ = require('lodash');
const assert = require('assert');
const rollup = require('rollup');
const hypothetical = require('rollup-plugin-hypothetical');
const translationXML = require('../dist/plugins/translation-xml');

describe('plugins', () => {
  let bundleModules;
  describe('translation-xml', () => {
    before(() =>
      rollup
        .rollup({
          input: './trad.xml',
          plugins: [
            hypothetical({
              files: {
                './trad.xml': `<translations>
              <translation id="foo" qtlid="1">Foo</translation>
              <translation id="bar" qtlid="2">Bar</translation>
              <translation id="hello" qtlid="3">Hello {0}</translation>
              <translation>Missing id</translation>
            </translations>`,
              },
            }),
            translationXML({
              include: '*.xml',
            }),
          ],
        })
        .then((bundle) => {
          bundleModules = bundle.cache.modules;
        }),
    );

    it('should convert XML to JSON', () => {
      const code = _.chain(bundleModules)
        .head()
        .get('code')
        .value();
      assert(
        code ===
          'export default {"foo":"Foo","bar":"Bar","hello":"Hello {{t0}}"};',
      );
    });
  });
});
