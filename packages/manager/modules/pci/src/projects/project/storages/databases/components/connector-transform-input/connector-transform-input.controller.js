import { TRANSFORMATIONS_TYPES } from './connector-transform-input.constants';

export default class PciConnectorTransformInputController {
  $onInit() {
    this.transformTypes = TRANSFORMATIONS_TYPES;
    this.transformIndex = 0;
    this.transformations = this.getTransformationsFromModel();
  }

  getTransformationsFromModel() {
    const transformations = [];
    if (this.model.transorms) {
      this.model.transforms.split(',').forEach((transformationName) => {
        transformations.push({
          name: transformationName,
          type: this.model[`transforms.${transformationName}.type`],
          offsetField: this.model[
            `transforms.${transformationName}.offset.field`
          ],
          partitionField: this.model[
            `transforms.${transformationName}.partition.field`
          ],
          staticField: this.model[
            `transforms.${transformationName}.static.field`
          ],
          staticValue: this.model[
            `transforms.${transformationName}.static.value`
          ],
          timestampField: this.model[
            `transforms.${transformationName}.timestamp.field`
          ],
          topicValue: this.model[
            `transforms.${transformationName}.topic.value`
          ],
          added: true,
        });
      });
    }
    this.transformIndex = transformations.length + 1;
    // Add empty value
    transformations.push({
      name: `transform-${this.transformIndex}`,
      type: this.transformTypes[0],
    });
    return transformations;
  }

  setModelTransformationsName() {
    this.model.transforms = this.transformations
      .filter((t) => t.added)
      .map((transformation) => transformation.name)
      .join(',');
  }

  onAddTransform($index) {
    // Add transform names
    this.transformations[$index].added = true;
    this.setModelTransformationsName();
    // Add transform properties
    const transformation = this.transformations[$index];
    this.model[`transforms.${transformation.name}.type`] = transformation.type;
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
    // Add empty value for form
    this.transformIndex += 1;
    this.transformations.push({
      name: `transform-${this.transformIndex}`,
      type: this.transformTypes[0],
    });
  }

  onRemoveTransform($index) {
    // delete old values from model:
    const transformationName = this.transformations[$index].name;
    this.model[`transforms.${transformationName}.type`] = undefined;
    this.model[`transforms.${transformationName}.offset.field`] = undefined;
    this.model[`transforms.${transformationName}.partition.field`] = undefined;
    this.model[`transforms.${transformationName}.static.field`] = undefined;
    this.model[`transforms.${transformationName}.static.value`] = undefined;
    this.model[`transforms.${transformationName}.timestamp.field`] = undefined;
    this.model[`transforms.${transformationName}.topic.value`] = undefined;
    this.transformations.splice($index, 1);
    this.setModelTransformationsName();
  }
}
