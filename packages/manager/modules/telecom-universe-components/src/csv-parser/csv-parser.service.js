import CSV from 'CSV-JS';

export default function () {
  this.setColumnSeparator = function setColumnSeparator(separatorParam) {
    let separator = separatorParam;

    if (separator === undefined) {
      separator = ';';
    }

    CSV.COLUMN_SEPARATOR = separator;
  };

  this.setDetectTypes = function setDetectTypes(detectParam) {
    let detect = detectParam;

    if (detect === undefined) {
      detect = false;
    }

    CSV.DETECT_TYPES = detect;
  };

  this.parse = function parse(data) {
    return CSV.parse(data);
  };
}
