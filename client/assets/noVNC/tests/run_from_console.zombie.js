const Browser = require('zombie');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const Q = require('q');

const provide_emitter = function (file_paths) {
  const emitter = new EventEmitter();

  file_paths.reduce((prom, file_path, path_ind) => prom.then((browser) => {
    browser.visit(`file://${file_path}`, () => {
      if (browser.error) throw new Error(browser.errors);

      const res_json = {};
      res_json.file_ind = path_ind;

      res_json.num_tests = browser.querySelectorAll('li.test').length;
      res_json.num_fails = browser.querySelectorAll('li.test.fail').length;
      res_json.num_passes = browser.querySelectorAll('li.test.pass').length;
      res_json.num_slow = browser.querySelectorAll('li.test.pass:not(.fast)').length;
      res_json.num_skipped = browser.querySelectorAll('li.test.pending').length;
      res_json.duration = browser.text('li.duration em');

      var traverse_node = function (elem) {
        const classList = elem.className.split(' ');
        let res;
        if (classList.indexOf('suite') > -1) {
          res = {
            type: 'suite',
            name: elem.querySelector('h1').textContent,
            has_subfailures: elem.querySelectorAll('li.test.fail').length > 0,
          };

          const child_elems = elem.querySelector('ul').children;
          res.children = Array.prototype.map.call(child_elems, traverse_node);
          return res;
        }

        const h2_content = elem.querySelector('h2').childNodes;
        res = {
          type: 'test',
          text: h2_content[0].textContent,
        };

        if (classList.indexOf('pass') > -1) {
          res.pass = true;
          if (classList.indexOf('pending') > -1) {
            res.slow = false;
            res.skipped = true;
          } else {
            res.slow = classList.indexOf('fast') < 0;
            res.skipped = false;
            res.duration = h2_content[1].textContent;
          }
        } else {
          res.error = elem.querySelector('pre.error').textContent;
        }

        return res;
      };

      const top_suites = browser.querySelectorAll('#mocha-report > li.suite');
      res_json.suites = Array.prototype.map.call(top_suites, traverse_node);
      res_json.replay = browser.querySelector('a.replay').textContent;

      emitter.emit('test_ready', res_json);
    });

    return new Browser();
  }), Q(new Browser()));

  return emitter;
};

module.exports = {
  provide_emitter,
  name: 'ZombieJS',
};
