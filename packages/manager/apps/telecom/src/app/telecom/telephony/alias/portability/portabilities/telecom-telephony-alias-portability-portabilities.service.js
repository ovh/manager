import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default class TelephonyPortabilitiesService {
  static groupPortaByNumbers(portabilities) {
    let numbers = [];
    forEach(portabilities, (portability) => {
      numbers = portability.numbersList.map(number => ({
        number,
        portability,
        lastStepDone: find(portability.steps.slice().reverse(), { status: 'done' }),
      }));
    });
    return numbers;
  }
}
