import remove from 'lodash/remove';
import set from 'lodash/set';
import { TRANSFORM_PROPERTY_KEY } from '../../../../../../components/project/storages/databases/connectors.constants';

export default class PciConnectorTransformInputController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
    this.addOption = PciConnectorTransformInputController.addOption;
    this.deleteOption = PciConnectorTransformInputController.deleteOption;
    this.onTypeChange = PciConnectorTransformInputController.onTypeChange;
  }

  $onInit() {
    this.transformIndex = 1;
    this.transformations = this.getTransformationsFromModel();

    this.$scope.$watch(
      '$ctrl.transformations',
      () => {
        this.syncModel();
      },
      true,
    );
  }

  getAddableFields(transformation) {
    const fields =
      this.configuration.getTransformFields(transformation.type) || [];
    return fields.filter(
      (field) =>
        !transformation.options.find((option) => option.name === field.name),
    );
  }

  static addOption(transformation, advancedField) {
    transformation.options.push(advancedField);
  }

  static deleteOption(transformation, advancedField) {
    remove(transformation.options, (o) => o.name === advancedField.name);
    set(transformation, advancedField.name, undefined);
  }

  addTransformation() {
    this.transformations.push({
      name: `${TRANSFORM_PROPERTY_KEY}-${this.transformIndex}`,
      type: this.data.values[0],
      previousType: this.data.values[0],
      options: [],
    });
    this.transformIndex += 1;
  }

  removeTransformation($index) {
    this.transformations.splice($index, 1);
  }

  static onTypeChange(modelValue, transformation) {
    transformation.options.forEach((option) => {
      set(transformation, option.name, undefined);
    });
    set(transformation, 'options', []);
    set(transformation, 'previousType', modelValue);
  }

  syncModel() {
    // clean older values
    Object.keys(this.model)
      .filter((key) => key.startsWith('transforms.'))
      .forEach((key) => {
        this.model[key] = undefined;
      });
    // add new values
    this.model.transforms = this.transformations
      .map((transformation) => transformation.name)
      .join(',');
    this.transformations.forEach((transformation) => {
      this.model[`transforms.${transformation.name}.type`] =
        transformation.type;
      transformation.options.forEach((option) => {
        const value = transformation[option.name];
        this.model[`transforms.${transformation.name}.${option.name}`] =
          value || null;
      });
    });
  }

  getTransformationsFromModel() {
    const transformations = [];
    if (this.model.transforms) {
      this.model.transforms.split(',').forEach((transformationName) => {
        const transformationModel = {
          name: transformationName,
          type: this.model[`transforms.${transformationName}.type`],
          options: [],
        };
        const optionsFields = this.configuration.getTransformFields(
          transformationModel.type,
        );
        Object.keys(this.model)
          .filter(
            (key) =>
              key.startsWith(`transforms.${transformationName}.`) &&
              key !== `transforms.${transformationName}.type`,
          )
          .forEach((optionKey) => {
            const shortOptionKey = optionKey.replace(
              `transforms.${transformationName}.`,
              '',
            );
            transformationModel[shortOptionKey] = this.model[optionKey];
            transformationModel.options.push(
              optionsFields.find((field) => field.name === shortOptionKey),
            );
          });
        transformations.push(transformationModel);
      });
    }
    this.transformIndex = transformations.length + 1;
    return transformations;
  }
}
