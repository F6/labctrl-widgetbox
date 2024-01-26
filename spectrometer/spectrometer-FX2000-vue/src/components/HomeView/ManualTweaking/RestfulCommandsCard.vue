<template>
  <a-card title="RESTful Commands">
    <div ref="FX2000SpectrometerSpectrumPlot" class="plotly-plot"></div>
    <a-form
      :model="FX2000SpectrometerParameterInputState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="Integration Time">
        <a-input-group compact>
          <a-input-number
            v-model:value="
              FX2000SpectrometerParameterInputState.integration_time.value
            "
            style="width: calc(100% - 180px)"
            placeholder="t"
          />
          <a-select
            v-model:value="
              FX2000SpectrometerParameterInputState.integration_time.unit
            "
            style="width: 100px"
          >
            <a-select-option value="s">s</a-select-option>
            <a-select-option value="ms">ms</a-select-option>
            <a-select-option value="us">us</a-select-option>
            <a-select-option value="ns">ns</a-select-option>
          </a-select>
          <a-button
            @click="onSetIntegrationTime"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Boxcar Width">
        <a-input-group compact>
          <a-input-number
            v-model:value="
              FX2000SpectrometerParameterInputState.boxcar_width.value
            "
            style="width: calc(100% - 80px)"
            placeholder="t"
          />
          <a-button
            @click="onSetBoxcarWidth"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Average Times">
        <a-input-group compact>
          <a-input-number
            v-model:value="
              FX2000SpectrometerParameterInputState.average_times.value
            "
            style="width: calc(100% - 80px)"
            placeholder="t"
          />
          <a-button
            @click="onSetAverageTimes"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
    </a-form>
    <a-space>
      <a-button @click="onTakeSpectrum" type="primary">
        Take Spectrum
      </a-button>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Plotly from "plotly.js";
import { callRESTfulAPI } from "@/common/connection";
import { useFX2000SpectrometerParameterInputStore } from "@/store/manual_tweaking";
import {
  useFX2000SpectrometerStatusStore,
  useFX2000SpectrometerPlotStore,
} from "@/store/spectrometer_fx2000";

const FX2000SpectrometerStatusStore = useFX2000SpectrometerStatusStore();

const FX2000SpectrometerParameterInputStore =
  useFX2000SpectrometerParameterInputStore();
const { FX2000SpectrometerParameterInputState } = storeToRefs(
  FX2000SpectrometerParameterInputStore
);

const FX2000SpectrometerPlotStore = useFX2000SpectrometerPlotStore();
const {
  FX2000SpectrometerPlotState,
  FX2000SpectrometerPlotConfig,
  FX2000SpectrometerSpectrumPlot,
  FX2000SpectrometerSpectrumPlotLayout,
} = storeToRefs(FX2000SpectrometerPlotStore);

const labelCol = { span: 8 };
const wrapperCol = { span: 14 };

async function onSetIntegrationTime() {
  const target_value =
    FX2000SpectrometerParameterInputStore.FX2000SpectrometerParameterInputState
      .integration_time;
  console.log("Setting Integratiom Time: ", target_value);
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      integration_time: target_value,
    })
  );
  if (result.result == "OK") {
    FX2000SpectrometerStatusStore.FX2000SpectrometerStatusState.integration_time =
      target_value;
  }
}

async function onSetBoxcarWidth() {
  const target_value =
    FX2000SpectrometerParameterInputStore.FX2000SpectrometerParameterInputState
      .boxcar_width.value;
  console.log("Setting Boxcar Width: ", target_value);
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      boxcar_width: target_value,
    })
  );
  if (result.result == "OK") {
    FX2000SpectrometerStatusStore.FX2000SpectrometerStatusState.boxcar_width.value =
      target_value;
  }
}

async function onSetAverageTimes() {
  const target_value =
    FX2000SpectrometerParameterInputStore.FX2000SpectrometerParameterInputState
      .average_times.value;
  console.log("Setting Average Times: ", target_value);
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      average_times: target_value,
    })
  );
  if (result.result == "OK") {
    FX2000SpectrometerStatusStore.FX2000SpectrometerStatusState.average_times.value =
      target_value;
  }
}

async function onTakeSpectrum() {
  console.log("Calling remote to take spectrum.");
  const result_spectrum = await callRESTfulAPI("spectrum", "GET", null);
  console.log("Calling remote to get wavelengths list.");
  const result_wavelength = await callRESTfulAPI("wavelengths", "GET", null);
  if (result_wavelength.wavelengths && result_spectrum.spectrum) {
    FX2000SpectrometerPlotState.value.spectrum.y = result_spectrum.spectrum;
    FX2000SpectrometerPlotState.value.spectrum.x =
      result_wavelength.wavelengths;
    // only update the plot if the plot is present
    if (FX2000SpectrometerSpectrumPlot.value) {
      // Plotly.extendTraces(
      //   FX2000SpectrometerSpectrumPlot.value,
      //   { x: [result_wavelength.wavelengths], y: [result_spectrum.spectrum] },
      //   [0]
      // );
      // because we are updating the whole figure, we just use a newPlot here.
      Plotly.newPlot(
        FX2000SpectrometerSpectrumPlot.value,
        [FX2000SpectrometerPlotState.value.spectrum],
        FX2000SpectrometerSpectrumPlotLayout.value,
        FX2000SpectrometerPlotConfig.value
      );
    }
  }
}

// When user navigates to other views, the plot is destroyed
//  and no longer renders updates to save CPU/GPU resources.
// When user switches back to this page, we recreate the plot
//  according to our newest data when the element is mounted.
onMounted(() => {
  Plotly.newPlot(
    FX2000SpectrometerSpectrumPlot.value,
    [FX2000SpectrometerPlotState.value.spectrum],
    FX2000SpectrometerSpectrumPlotLayout.value,
    FX2000SpectrometerPlotConfig.value
  );
});
</script>
