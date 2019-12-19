import countBy from 'lodash/countBy';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';

export default () => ({
  restrict: 'A',
  scope: {
    pwd: '=ovhPwdStrength',
    value: '=strength',
  },
  replace: true,
  template: '<div class="ovh-password-strength-bar {{ getClass(value) }}"><progressbar value="getRoundValue(value)" animate="false"></progressbar></div>',
  link($scope) {
    function strReverse(str) {
      let reverse = '';
      forEach(str, (e) => {
        reverse += e;
      });
      return reverse;
    }

    $scope.getRoundValue = function getRoundValue(value) {
      let result = value;
      if (result > 0) {
        if (result > 66) {
          result = 100;
        } else if (result > 33) {
          result = 66;
        } else {
          result = 33;
        }
      }
      return result;
    };

    $scope.getClass = function getClass(value) {
      let clazz = '';

      if (value > 66) {
        clazz = 'ovh-password-strength-bar-hard';
      } else if (value > 33) {
        clazz = 'ovh-password-strength-bar-medium';
      } else if (value > 0) {
        clazz = 'ovh-password-strength-bar-weak';
      }

      return clazz;
    };

    const matches = {
      pos: {},
      neg: {},
    };

    const counts = {
      pos: {},
      neg: {
        seqLetter: 0,
        seqNumber: 0,
        seqSymbol: 0,
      },
    };

    const checkStrength = function checkStrength(p) {
      let tmp;
      let strength = 0;
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '01234567890';
      const symbols = '\\!@#$%&/()=?¿';
      let back;
      let forth;
      let i;

      if (p) {
        // Benefits
        matches.pos.lower = p.match(/[a-z]/g);
        matches.pos.upper = p.match(/[A-Z]/g);
        matches.pos.numbers = p.match(/\d/g);
        matches.pos.symbols = p.match(/[$-/:-?{-~!^_`[\]]/g);
        matches.pos.middleNumber = p.slice(1, -1).match(/\d/g);
        matches.pos.middleSymbol = p.slice(1, -1).match(/[$-/:-?{-~!^_`[\]]/g);

        counts.pos.lower = matches.pos.lower ? matches.pos.lower.length : 0;
        counts.pos.upper = matches.pos.upper ? matches.pos.upper.length : 0;
        counts.pos.numbers = matches.pos.numbers ? matches.pos.numbers.length : 0;
        counts.pos.symbols = matches.pos.symbols ? matches.pos.symbols.length : 0;

        tmp = reduce(
          counts.pos, (memo, val) => memo + Math.min(1, val),
          0,
        );

        counts.pos.numChars = p.length;
        tmp += counts.pos.numChars >= 8 ? 1 : 0;

        counts.pos.requirements = tmp >= 3 ? tmp : 0;
        counts.pos.middleNumber = matches.pos.middleNumber ? matches.pos.middleNumber.length : 0;
        counts.pos.middleSymbol = matches.pos.middleSymbol ? matches.pos.middleSymbol.length : 0;

        // Deductions
        matches.neg.consecLower = p.match(/(?=([a-z]{2}))/g);
        matches.neg.consecUpper = p.match(/(?=([A-Z]{2}))/g);
        matches.neg.consecNumbers = p.match(/(?=(\d{2}))/g);
        matches.neg.onlyNumbers = p.match(/^[0-9]*$/g);
        matches.neg.onlyLetters = p.match(/^([a-z]|[A-Z])*$/g);

        counts.neg.consecLower = matches.neg.consecLower ? matches.neg.consecLower.length : 0;
        counts.neg.consecUpper = matches.neg.consecUpper ? matches.neg.consecUpper.length : 0;
        counts.neg.consecNumbers = matches.neg.consecNumbers ? matches.neg.consecNumbers.length : 0;

        // sequential letters (back and forth)
        for (i = 0; i < letters.length - 2; i += 1) {
          const p2 = p.toLowerCase();
          forth = letters.substring(i, parseInt(i + 3, 10));
          strReverse(forth);
          back = strReverse(forth);
          if (p2.indexOf(forth) !== -1 || p2.indexOf(back) !== -1) {
            counts.neg.seqLetter += 1;
          }
        }

        // sequential numbers (back and forth)
        for (i = 0; i < numbers.length - 2; i += 1) {
          forth = numbers.substring(i, parseInt(i + 3, 10));
          back = strReverse(forth);
          if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
            counts.neg.seqNumber += 1;
          }
        }

        // sequential symbols (back and forth)
        for (i = 0; i < symbols.length - 2; i += 1) {
          forth = symbols.substring(i, parseInt(i + 3, 10));
          back = strReverse(forth);
          if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
            counts.neg.seqSymbol += 1;
          }
        }

        // repeated chars
        counts.neg.repeated = reduce(
          reject(
            countBy(
              p.toLowerCase().split(''),
              (val) => val,
            ),
            (val) => val === 1,
          ),
          (memo, val) => memo + val,
          0,
        );

        // Calculations
        strength += counts.pos.numChars * 4;
        if (counts.pos.upper) {
          strength += (counts.pos.numChars - counts.pos.upper) * 2;
        }
        if (counts.pos.lower) {
          strength += (counts.pos.numChars - counts.pos.lower) * 2;
        }
        if (counts.pos.upper || counts.pos.lower) {
          strength += counts.pos.numbers * 4;
        }

        strength += counts.pos.symbols * 6;
        strength += (counts.pos.middleSymbol + counts.pos.middleNumber) * 2;
        strength += counts.pos.requirements * 2;

        strength -= counts.neg.consecLower * 2;
        strength -= counts.neg.consecUpper * 2;
        strength -= counts.neg.consecNumbers * 2;
        strength -= counts.neg.seqNumber * 3;
        strength -= counts.neg.seqLetter * 3;
        strength -= counts.neg.seqSymbol * 3;

        if (matches.neg.onlyNumbers) {
          strength -= counts.pos.numChars;
        }

        if (matches.neg.onlyLetters) {
          strength -= counts.pos.numChars;
        }

        if (counts.neg.repeated) {
          strength -= (counts.neg.repeated / counts.pos.numChars) * 10;
        }
      }

      return Math.max(0, Math.min(100, Math.round(strength)));
    };

    $scope.$watch('pwd', (newValue) => {
      $scope.value = checkStrength(newValue);
    });
  },
});
