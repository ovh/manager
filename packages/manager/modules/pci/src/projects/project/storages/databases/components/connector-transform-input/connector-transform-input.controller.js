import { remove } from 'lodash';

export default class PciConnectorInputController {
  $onInit() {
    this.transformIndex = 1;
    this.transformations = [];
    // TODO: extract existing transformations from model
    this.name = `transform-${this.transformIndex}`;

    this.transformTypes = [
      'org.apache.kafka.connect.transforms.InsertField$Key',
      'org.apache.kafka.connect.transforms.InsertField$Value',
      'org.apache.kafka.connect.transforms.ReplaceField$Key',
      'org.apache.kafka.connect.transforms.ReplaceField$Value',
      'org.apache.kafka.connect.transforms.MaskField$Key',
      'org.apache.kafka.connect.transforms.MaskField$Value',
      'org.apache.kafka.connect.transforms.ValueToKey',
      'org.apache.kafka.connect.transforms.HoistField$Key',
      'org.apache.kafka.connect.transforms.HoistField$Value',
      'org.apache.kafka.connect.transforms.ExtractField$Key',
      'org.apache.kafka.connect.transforms.ExtractField$Value',
      'org.apache.kafka.connect.transforms.SetSchemaMetadata$Key',
      'org.apache.kafka.connect.transforms.SetSchemaMetadata$Value',
      'org.apache.kafka.connect.transforms.TimestampRouter',
      'org.apache.kafka.connect.transforms.RegexRouter',
      'org.apache.kafka.connect.transforms.Flatten$Key',
      'org.apache.kafka.connect.transforms.Flatten$Value',
      'org.apache.kafka.connect.transforms.Cast$Key',
      'org.apache.kafka.connect.transforms.Cast$Value',
      'org.apache.kafka.connect.transforms.TimestampConverter$Key',
      'org.apache.kafka.connect.transforms.TimestampConverter$Value',
      'io.aiven.kafka.connect.transforms.ExtractTimestamp$Key',
      'io.aiven.kafka.connect.transforms.ExtractTimestamp$Value',
      'io.aiven.kafka.connect.transforms.ExtractTopic$Key',
      'io.aiven.kafka.connect.transforms.ExtractTopic$Value',
      'io.aiven.kafka.connect.transforms.Hash$Key',
      'io.aiven.kafka.connect.transforms.Hash$Value',
      'io.aiven.kafka.connect.transforms.TombstoneHandler',
      'io.debezium.transforms.ByLogicalTableRouter',
      'io.debezium.transforms.ExtractNewRecordState',
      'io.debezium.transforms.outbox.EventRouter',
    ];
  }

  syncWithModel() {
    this.model.transforms = this.transformations
      .map((transformation) => transformation.name)
      .join(',');
    this.transformations.forEach((transformation) => {
      this.model[`transforms.${transformation.name}.type`] =
        transformation.type;
      this.model[`transforms.${transformation.name}.offset.field`] =
        transformation.offsetField;
      this.model[`transforms.${transformation.name}.partition.field`] =
        transformation.partitionField;
      this.model[`transforms.${transformation.name}.static.field`] =
        transformation.staticField;
      this.model[`transforms.${transformation.name}.static.value`] =
        transformation.staticValue;
      this.model[`transforms.${transformation.name}.timestamp.field`] =
        transformation.timestampField;
      this.model[`transforms.${transformation.name}.topic.value`] =
        transformation.topicValue;
    });
  }

  onAddTransform(form) {
    this.transformations.push({
      name: form.name.$modelValue,
      type: form.type.$modelValue,
      offsetField: form.offsetField.$modelValue,
      partitionField: form.partitionField.$modelValue,
      staticField: form.staticField.$modelValue,
      staticValue: form.staticValue.$modelValue,
      timestampField: form.timestampField.$modelValue,
      topicValue: form.topicValue.$modelValue,
    });
    this.syncWithModel();
    this.transformIndex += 1;
    this.name = `transform-${this.transformIndex}`;
  }

  onRemoveTransform(form) {
    // delete old values from model:
    const transformationName = form.name.$modelValue;
    this.model[`transforms.${transformationName}.type`] = undefined;
    this.model[`transforms.${transformationName}.offset.field`] = undefined;
    this.model[`transforms.${transformationName}.partition.field`] = undefined;
    this.model[`transforms.${transformationName}.static.field`] = undefined;
    this.model[`transforms.${transformationName}.static.value`] = undefined;
    this.model[`transforms.${transformationName}.timestamp.field`] = undefined;
    this.model[`transforms.${transformationName}.topic.value`] = undefined;
    remove(this.transformations, (t) => t.name === transformationName);
    this.syncWithModel();
  }
}
