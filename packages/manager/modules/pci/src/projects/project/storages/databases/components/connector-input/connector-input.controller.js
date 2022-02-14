export default class PciConnectorInputController {
  $onInit() {
    this.display =
      [
        'string',
        'int64',
        'int32',
        'int16',
        'boolean',
        'list',
        'transform',
        'class',
        'map',
      ].includes(this.data.type) && this.data.name !== 'connector.class';

    // For booleans, we use an intermediate variable
    if (this.data.type === 'boolean') {
      this.tempValue = 'default';
    }

    this.classes = [
      '',
      'org.apache.kafka.connect.storage.StringConverter',
      'org.apache.kafka.connect.json.JsonConverter',
      'org.apache.kafka.connect.converters.ByteArrayConverter',
      'io.confluent.connect.avro.AvroConverter',
    ];
  }

  onRadioChange(newVal) {
    if (newVal !== 'default') {
      this.model[this.data.name] = newVal;
    } else {
      this.model[this.data.name] = undefined;
    }
  }

  onMapAdd(form) {
    this.model[form.key.$modelValue] = form.value.$modelValue;
  }

  onMapRemove(form) {
    this.model[form.key.$modelValue] = undefined;
  }
}
