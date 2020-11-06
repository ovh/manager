import { UnitAndValue } from '../unit-and-value.class';
import { AVAILABLE_SIZE_UNITS } from './constants';

export class UnitAndValueSize extends UnitAndValue {
  constructor({ unit, value }) {
    super({ unit, value });
  }

  static convertToSize(value, fromUnit, toUnit) {
    if (!AVAILABLE_SIZE_UNITS.includes(fromUnit)) {
      throw new RangeError(
        `[UnitAndValueSize.convertTo]: ${fromUnit} is an invalid unit`,
      );
    }

    if (!AVAILABLE_SIZE_UNITS.includes(toUnit)) {
      throw new RangeError(
        `[UnitAndValueSize.convertTo]: ${toUnit} is an invalid unit`,
      );
    }

    if (fromUnit === toUnit) {
      return new UnitAndValueSize({
        value,
        unit: toUnit,
      });
    }

    const fromUnitIndex = AVAILABLE_SIZE_UNITS.indexOf(fromUnit);
    const toUnitIndex = AVAILABLE_SIZE_UNITS.indexOf(toUnit);
    const toValue =
      toUnitIndex > fromUnitIndex
        ? value / Math.pow(1000, toUnitIndex - fromUnitIndex)
        : value * Math.pow(1000, fromUnitIndex - toUnitIndex);

    return new UnitAndValueSize({
      value: toValue,
      unit: toUnit,
    });
  }

  static convertToReadableSize(value, unit) {
    const unitIndex = AVAILABLE_SIZE_UNITS.indexOf(unit);
    const nextUnit = unitIndex + 1;

    if (value > 1000 && nextUnit < AVAILABLE_SIZE_UNITS.length) {
      const converted = UnitAndValueSize.convertToSize(
        value,
        unit,
        AVAILABLE_SIZE_UNITS[nextUnit],
      );
      return UnitAndValueSize.convertToReadableSize(
        converted.value,
        converted.unit,
      );
    }

    return new UnitAndValueSize({
      value,
      unit,
    });
  }

  convertTo(toUnit) {
    return UnitAndValueSize.convertToSize(this.value, this.unit, toUnit);
  }

  convertToReadable() {
    return UnitAndValueSize.convertToReadableSize(this.value, this.unit);
  }
}
