import { defineStore } from "pinia";
import { RemovableRef, useStorage } from "@vueuse/core";
import { computed, UnwrapRef, reactive } from "vue";
import { AbsoluteQuantity, LogicalQuantity } from "@/common/unit";

export interface FX2000SpectrometerParameterInputState {
  integration_time: AbsoluteQuantity;
  boxcar_width: LogicalQuantity;
  average_times: LogicalQuantity;
}

// This store is for inputs that controls parameters of the spectrometer.
export const useFX2000SpectrometerParameterInputStore = defineStore(
  "spectrometer-fx2000-widgetbox-spectrometer-fx2000-parameter-input",
  () => {
    const FX2000SpectrometerParameterInputState: RemovableRef<FX2000SpectrometerParameterInputState> =
      useStorage(
        "spectrometer-fx2000-widgetbox-spectrometer-fx2000-parameter-input-local-storage",
        {
          integration_time: { value: 10, unit: "ms" },
          boxcar_width: { value: 1 },
          average_times: { value: 1 },
        }
      );

    return {
      FX2000SpectrometerParameterInputState,
    };
  }
);
