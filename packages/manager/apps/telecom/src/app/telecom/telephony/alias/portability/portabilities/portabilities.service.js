import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default function groupPortaByNumbers(portabilities) {
  const numbers = [];
  forEach(portabilities, (portability) => {
    forEach(portability.numbersList, (number) => {
      numbers.push({
        number,
        portability,
        lastStepDone: find(portability.steps.slice().reverse(), {
          status: 'done',
        }),
      });
    });
  });
  return numbers;
}
