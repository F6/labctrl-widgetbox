<template>
  <a-card title="RESTful Commands">
    <a-form
      :model="genericSensorParameterInputState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="Temperature Sampling Interval">
        <a-input-group compact>
          <a-input-number
            v-model:value="
              genericSensorParameterInputState.temperature_sampling_interval
                .value
            "
            style="width: calc(100% - 180px)"
            placeholder="t"
          />
          <a-select
            v-model:value="
              genericSensorParameterInputState.temperature_sampling_interval
                .unit
            "
            style="width: 100px"
          >
            <a-select-option value="s">s</a-select-option>
            <a-select-option value="ms">ms</a-select-option>
            <a-select-option value="us">us</a-select-option>
            <a-select-option value="ns">ns</a-select-option>
          </a-select>
          <a-button
            @click="onSetTemperatureSamplingInterval"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Humidity Sampling Interval">
        <a-input-group compact>
          <a-input-number
            v-model:value="
              genericSensorParameterInputState.humidity_sampling_interval.value
            "
            style="width: calc(100% - 180px)"
            placeholder="t"
          />
          <a-select
            v-model:value="
              genericSensorParameterInputState.humidity_sampling_interval.unit
            "
            style="width: 100px"
          >
            <a-select-option value="s">s</a-select-option>
            <a-select-option value="ms">ms</a-select-option>
            <a-select-option value="us">us</a-select-option>
            <a-select-option value="ns">ns</a-select-option>
          </a-select>
          <a-button
            @click="onSetHumiditySamplingInterval"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
    </a-form>
    <a-space>
      <a-button @click="onStartContinuousSamplingMode" type="primary">
        Start Continuous Sampling Mode
      </a-button>
      <a-button @click="onStopContinuousSamplingMode" type="primary">
        Stop Continuous Sampling Mode
      </a-button>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { callRESTfulAPI } from "@/common/connection";
import { useGenericSensorParameterInputStore } from "@/store/manual_tweaking";
import { useGenericSensorStatusStore } from "@/store/generic_sensor";

const genericSensorParameterInputStore = useGenericSensorParameterInputStore();
const genericSensorStatusStore = useGenericSensorStatusStore();
const { genericSensorParameterInputState } = storeToRefs(
  genericSensorParameterInputStore
);
const labelCol = { span: 8 };
const wrapperCol = { span: 14 };

async function onSetTemperatureSamplingInterval() {
  const target_value =
    genericSensorParameterInputStore.genericSensorParameterInputState
      .temperature_sampling_interval;
  console.log("Setting Temperature Sampling Interval: ", target_value);
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      temperature_sampling_interval: target_value,
    })
  );
  if (result.result == "OK") {
    genericSensorStatusStore.genericSensorStatusState.temperature_sampling_interval =
      target_value;
  }
}

async function onSetHumiditySamplingInterval() {
  const target_value =
    genericSensorParameterInputStore.genericSensorParameterInputState
      .humidity_sampling_interval;
  console.log("Setting Humidity Sampling Interval: ", target_value);
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      humidity_sampling_interval: target_value,
    })
  );
  if (result.result == "OK") {
    genericSensorStatusStore.genericSensorStatusState.humidity_sampling_interval =
      target_value;
  }
}

async function onStartContinuousSamplingMode() {
  console.log("Calling remote to start continous sampling mode.");
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      continuous_sampling_mode: true,
    })
  );
  if (result.result == "OK") {
    genericSensorStatusStore.genericSensorStatusState.continous_sampling_mode =
      true;
  }
}

async function onStopContinuousSamplingMode() {
  console.log("Calling remote to stop continous sampling mode.");
  const result = await callRESTfulAPI(
    "parameter",
    "POST",
    JSON.stringify({
      continuous_sampling_mode: false,
    })
  );
  if (result.result == "OK") {
    genericSensorStatusStore.genericSensorStatusState.continous_sampling_mode =
      false;
  }
}
</script>
