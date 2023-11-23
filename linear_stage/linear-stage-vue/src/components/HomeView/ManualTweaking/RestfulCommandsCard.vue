<template>
  <a-card title="RESTful Commands">
    <a-form
      :model="linearStageInputState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="Logical Position">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.position.value"
            style="width: calc(100% - 80px)"
            placeholder="pos"
          />
          <a-button
            @click="onSetPosition"
            type="primary"
            style="background-color: #f0ad4e; width: 80px"
          >
            Move
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Absolute Position">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.absolute_position.value"
            style="width: calc(100% - 180px)"
            placeholder="abspos"
          />
          <a-select
            v-model:value="linearStageInputState.absolute_position.unit"
            style="width: 100px"
          >
            <a-select-option value="m">m</a-select-option>
            <a-select-option value="mm">mm</a-select-option>
            <a-select-option value="um">um</a-select-option>
            <a-select-option value="nm">nm</a-select-option>
          </a-select>
          <a-button
            @click="onSetAbsolutePosition"
            type="primary"
            style="background-color: #f0ad4e; width: 80px"
          >
            Move
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Velocity">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.velocity.value"
            style="width: calc(100% - 180px)"
            placeholder="vel"
          />
          <a-select
            v-model:value="linearStageInputState.velocity.unit"
            style="width: 100px"
          >
            <a-select-option value="m/s">m/s</a-select-option>
            <a-select-option value="mm/s">mm/s</a-select-option>
            <a-select-option value="um/s">um/s</a-select-option>
            <a-select-option value="nm/s">nm/s</a-select-option>
          </a-select>
          <a-button @click="onSetVelocity" type="primary" style="width: 80px">
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Acceleration">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.acceleration.value"
            style="width: calc(100% - 200px)"
            placeholder="acc"
          />
          <a-select
            v-model:value="linearStageInputState.acceleration.unit"
            style="width: 120px"
          >
            <a-select-option value="m/(s^2)">m/(s^2)</a-select-option>
            <a-select-option value="mm/(s^2)">mm/(s^2)</a-select-option>
            <a-select-option value="um/(s^2)">um/(s^2)</a-select-option>
            <a-select-option value="nm/(s^2)">nm/(s^2)</a-select-option>
          </a-select>
          <a-button
            @click="onSetAcceleration"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import {
  useLinearStageInputStore,
  useLinearStageStatusStore,
} from "@/store/manual_tweaking";
import { callRESTfulAPI } from "@/common/connection";
import { storeToRefs } from "pinia";
const linearStageInputStore = useLinearStageInputStore();
const linearStageStatusStore = useLinearStageStatusStore();
const { linearStageInputState } = storeToRefs(linearStageInputStore);
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };

async function onSetPosition() {
  const target_value =
    linearStageInputStore.linearStageInputState.position.value;
  console.log("Moving linear stage to position: ", target_value);
  const result = await callRESTfulAPI(
    "position",
    "POST",
    JSON.stringify({
      value: target_value,
    })
  );
  if (result.result == "OK") {
    linearStageStatusStore.linearStageStatusState.position.value = target_value;
  }
}

async function onSetAbsolutePosition() {
  const target = linearStageInputStore.linearStageInputState.absolute_position;
  console.log("Moving linear stage to absolute position: ", target);
  const result = await callRESTfulAPI(
    "absolute_position",
    "POST",
    JSON.stringify(target)
  );
  if (result.result == "OK") {
    linearStageStatusStore.linearStageStatusState.absolute_position.value =
      target.value;
    linearStageStatusStore.linearStageStatusState.absolute_position.unit =
      target.unit;
  }
}

async function onSetVelocity() {
  const target = linearStageInputStore.linearStageInputState.velocity;
  console.log("Setting linear stage velocity: ", target);
  const result = await callRESTfulAPI(
    "velocity",
    "POST",
    JSON.stringify(target)
  );
  if (result.result == "OK") {
    linearStageStatusStore.linearStageStatusState.velocity.value = target.value;
    linearStageStatusStore.linearStageStatusState.velocity.unit = target.unit;
  }
}

async function onSetAcceleration() {
  const target = linearStageInputStore.linearStageInputState.acceleration;
  console.log("Setting linear stage acceleration: ", target);
  const result = await callRESTfulAPI(
    "acceleration",
    "POST",
    JSON.stringify(target)
  );
  if (result.result == "OK") {
    linearStageStatusStore.linearStageStatusState.acceleration.value =
      target.value;
    linearStageStatusStore.linearStageStatusState.acceleration.unit =
      target.unit;
  }
}
</script>
