import { defineStore } from "pinia";
import { RemovableRef, useStorage } from "@vueuse/core";
import { computed, UnwrapRef, reactive } from "vue";
import { AbsoluteQuantity } from "@/common/unit";

export interface GenericSensorParameterInputState {
  temperature_sampling_interval: AbsoluteQuantity;
  humidity_sampling_interval: AbsoluteQuantity;
}

// This store is for inputs that controls parameters of the sensor.
export const useGenericSensorParameterInputStore = defineStore(
  "sensor-generic-widgetbox-sensor-generic-parameter-input",
  () => {
    const genericSensorParameterInputState: RemovableRef<GenericSensorParameterInputState> =
      useStorage(
        "sensor-generic-widgetbox-sensor-generic-parameter-input-local-storage",
        {
          temperature_sampling_interval: { value: 100, unit: "ms" },
          humidity_sampling_interval: { value: 100, unit: "ms" },
        }
      );

    return {
      genericSensorParameterInputState,
    };
  }
);
