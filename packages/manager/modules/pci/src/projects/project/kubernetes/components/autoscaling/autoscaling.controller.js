import { AUTOSCALING_LINK } from './autoscaling.constants';
import {
  SCALE_DEFAULT_VALUES,
  ANTI_AFFINITY_MAX_NODES,
} from '../../kubernetes.constants';

export default class AutoscalingController {
  static triggerHandlerFunction(fn, data) {
    if (fn instanceof Function) fn(data);
  }

  static isValidKubeScale(autoscale, min, desired, max) {
    if (autoscale) {
      return min < max;
    }

    return desired >= SCALE_DEFAULT_VALUES.LOWEST_MIN_VALUE;
  }

  /* @ngInject */
  constructor($scope, coreConfig) {
    this.$scope = $scope;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.autoscalingInfoLink = this.getAutoscalingInfoLink();
    this.LOWEST_VALUE = SCALE_DEFAULT_VALUES.LOWEST_VALUE;
  }

  $onInit() {
    this.model = this.nodePool.autoscaling;
    const { lowest, desired, highest } = this.model.nodes;

    this.init(true);
    this.setAutoscalingValidity(lowest.value, desired.value, highest.value);
  }

  init(isInit) {
    if (!this.nodePool.antiAffinity) {
      this.setUnscaleCaseLimits(isInit);
      this.setScaleCaseLimits(isInit);
    } else {
      this.initAntiAffinityCase();
    }
  }

  setUnscaleCaseLimits(isInit) {
    const { desiredNodes } = this.nodePool;
    const {
      LOWEST_MIN_VALUE,
      DESIRED_VALUE,
      HIGHEST_MAX_VALUE,
    } = SCALE_DEFAULT_VALUES;

    this.setDesiredNode({
      min: LOWEST_MIN_VALUE,
      value: this.isEditMode && isInit ? desiredNodes : DESIRED_VALUE,
      max: HIGHEST_MAX_VALUE,
    });
  }

  setScaleCaseLimits(isInit) {
    const { minNodes, maxNodes } = this.nodePool;
    const { LOWEST_MIN_VALUE, HIGHEST_MAX_VALUE } = SCALE_DEFAULT_VALUES;

    this.setLowestNode({
      min: LOWEST_MIN_VALUE,
      value: this.isEditMode && isInit ? minNodes : LOWEST_MIN_VALUE,
      max: this.isEditMode && isInit ? maxNodes : HIGHEST_MAX_VALUE,
    });
    this.setHighestNode({
      min: this.isEditMode && isInit ? minNodes : LOWEST_MIN_VALUE,
      value: this.isEditMode && isInit ? maxNodes : HIGHEST_MAX_VALUE,
      max: HIGHEST_MAX_VALUE,
    });
  }

  initAntiAffinityCase() {
    const { lowest, desired, highest } = this.model.nodes;

    this.setHighestNode({
      value: Math.max(desired.value, ANTI_AFFINITY_MAX_NODES),
      max: ANTI_AFFINITY_MAX_NODES,
    });

    this.setDesiredNode({
      value: Math.min(desired.value, ANTI_AFFINITY_MAX_NODES),
      max: ANTI_AFFINITY_MAX_NODES,
    });

    this.setLowestNode({
      value: Math.min(desired.value, lowest.value),
      max: highest.value,
    });
  }

  setLowestNode({ min, value, max }) {
    const { lowest } = this.model.nodes;

    lowest.min = min >= 0 ? min : lowest.min;
    lowest.value = value >= 0 ? value : lowest.value;
    lowest.max = max >= 0 ? max : lowest.max;
  }

  setDesiredNode({ min, value, max }) {
    const { desired } = this.model.nodes;

    desired.min = min >= 0 ? min : desired.min;
    desired.value = value >= 0 ? value : desired.value;
    desired.max = max >= 0 ? max : desired.max;
  }

  setHighestNode({ min, value, max }) {
    const { highest } = this.model.nodes;

    highest.min = min >= 0 ? min : highest.min;
    highest.value = value >= 0 ? value : highest.value;
    highest.max = max >= 0 ? max : highest.max;
  }

  setAutoscalingValidity(minValue, desiredValue, maxValue) {
    const { autoscale } = this.model;

    this.model.isValidScale = AutoscalingController.isValidKubeScale(
      autoscale,
      minValue,
      desiredValue,
      maxValue,
    );
  }

  getAutoscalingInfoLink() {
    return AUTOSCALING_LINK[this.ovhSubsidiary] || AUTOSCALING_LINK.DEFAULT;
  }

  onAutoscaleChanged(autoscale) {
    this.init(false);

    AutoscalingController.triggerHandlerFunction(
      this.onAutoscalePoolChanged,
      autoscale,
    );
  }

  onLowestValueChange(min) {
    const { desired, highest } = this.model.nodes;

    if (this.model.autoscale) {
      highest.min = min.value;

      if (desired.value < min.value) {
        desired.value = min.value;
      }
    }

    this.setAutoscalingValidity(min.value, desired.value, highest.value);
    AutoscalingController.triggerHandlerFunction(
      this.onLowestPoolValueChanged,
      min,
    );
  }

  onDesiredValueChange(need) {
    const { lowest, highest } = this.model.nodes;

    if (
      !this.model.autoscale &&
      this.nodePool?.antiAffinity &&
      highest.value > ANTI_AFFINITY_MAX_NODES
    ) {
      this.nodePool.antiAffinity = false;
    }

    this.setAutoscalingValidity(lowest.value, need.value, highest.value);
    AutoscalingController.triggerHandlerFunction(
      this.onDesiredPoolValueChanged,
      need,
    );
  }

  onHighestValueChange(max) {
    const { lowest, desired } = this.model.nodes;

    if (this.model.autoscale) {
      lowest.max = max.value;

      if (desired.value > max.value) {
        desired.value = max.value;
      }

      if (this.nodePool?.antiAffinity && max.value > ANTI_AFFINITY_MAX_NODES) {
        this.nodePool.antiAffinity = false;
      }
    }

    this.setAutoscalingValidity(lowest.value, desired.value, max.value);
    AutoscalingController.triggerHandlerFunction(
      this.onHighestPoolValueChanged,
      max,
    );
  }
}
