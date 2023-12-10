import { defineStore } from "pinia";
import { RemovableRef, useStorage } from "@vueuse/core";
import { computed, UnwrapRef, reactive } from "vue";

export interface LinearStageQuantity {
  value: number | null;
  unit?: string;
}

export interface LinearStageStatusState {
  position: LinearStageQuantity;
  absolute_position: LinearStageQuantity;
  velocity: LinearStageQuantity;
  physical_velocity: LinearStageQuantity;
  acceleration: LinearStageQuantity;
  physical_acceleration: LinearStageQuantity;
}

// This store is for current stage status, which is synchronized with remote via RESTful or WebSocket
export const useLinearStageStatusStore = defineStore(
  "linear-stage-widgetbox-linear-stage-status",
  () => {
    const linearStageStatusState: UnwrapRef<LinearStageStatusState> = reactive({
      position: { value: null },
      absolute_position: { value: null, unit: "mm" },
      velocity: { value: null },
      physical_velocity: { value: null, unit: "mm/s" },
      acceleration: { value: null },
      physical_acceleration: { value: null, unit: "mm/(s^2)" },
    });

    const position_string = computed(() =>
      linearStageStatusState.position.value === null
        ? "Unknown"
        : `${linearStageStatusState.position.value}`
    );

    const absolute_position_string = computed(() =>
      linearStageStatusState.absolute_position.value === null
        ? "Unknown"
        : `${linearStageStatusState.absolute_position.value} ${linearStageStatusState.absolute_position.unit}`
    );

    const velocity_string = computed(() =>
      linearStageStatusState.velocity.value === null
        ? "Unknown"
        : `${linearStageStatusState.velocity.value}`
    );

    const physical_velocity_string = computed(() =>
      linearStageStatusState.physical_velocity.value === null
        ? "Unknown"
        : `${linearStageStatusState.physical_velocity.value} ${linearStageStatusState.physical_velocity.unit}`
    );

    const acceleration_string = computed(() =>
      linearStageStatusState.acceleration.value === null
        ? "Unknown"
        : `${linearStageStatusState.acceleration.value}`
    );

    const physical_acceleration_string = computed(() =>
      linearStageStatusState.physical_acceleration.value === null
        ? "Unknown"
        : `${linearStageStatusState.physical_acceleration.value} ${linearStageStatusState.physical_acceleration.unit}`
    );

    return {
      linearStageStatusState,
      position_string,
      absolute_position_string,
      velocity_string,
      physical_velocity_string,
      acceleration_string,
      physical_acceleration_string,
    };
  }
);

export interface LinearStageInputState {
  position: LinearStageQuantity;
  absolute_position: LinearStageQuantity;
  velocity: LinearStageQuantity;
  physical_velocity: LinearStageQuantity;
  acceleration: LinearStageQuantity;
  physical_acceleration: LinearStageQuantity;
}

// This store is for inputs that operates the stage.
export const useLinearStageInputStore = defineStore(
  "linear-stage-widgetbox-linear-stage-input",
  () => {
    const linearStageInputState: RemovableRef<LinearStageInputState> =
      useStorage("linear-stage-widgetbox-linear-stage-input-local-storage", {
        position: { value: 0 },
        absolute_position: { value: 0, unit: "mm" },
        velocity: { value: 100 },
        physical_velocity: { value: 100, unit: "mm/s" },
        acceleration: { value: 100 },
        physical_acceleration: { value: 100, unit: "mm/(s^2)" },
      });

    return {
      linearStageInputState,
    };
  }
);
