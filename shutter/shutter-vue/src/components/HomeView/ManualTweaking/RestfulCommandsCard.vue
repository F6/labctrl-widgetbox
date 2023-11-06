<template>
  <a-card title="RESTful Commands">
    <a-row :gutter="[16, 8]">
      <a-col>
        <a-card title="Shutter 1">
          <a-row :gutter="[16, 8]">
            <a-col>
              <a-button
                @click="onShutter1TurnON"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Turn ON
              </a-button>
            </a-col>
            <a-col>
              <a-button
                @click="onShutter1TurnOFF"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Turn OFF
              </a-button>
            </a-col>
            <a-col>
              <a-button
                @click="onShutter1Switch"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Switch
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col>
        <a-card title="Shutter 2">
          <a-row :gutter="[16, 8]">
            <a-col>
              <a-button
                @click="onShutter2TurnON"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Turn ON
              </a-button>
            </a-col>
            <a-col>
              <a-button
                @click="onShutter2TurnOFF"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Turn OFF
              </a-button>
            </a-col>
            <a-col>
              <a-button
                @click="onShutter2Switch"
                type="primary"
                style="background-color: #f0ad4e"
              >
                Switch
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
import { useShutterStatusStore } from "@/store/manual_tweaking";
import { callRESTfulAPI } from "@/common/connection";
const shutterStatusStore = useShutterStatusStore();

async function shutterCommand(shutter_name: string, action: string) {
  console.log("Shutter command: ", shutter_name, action);
  const result = await callRESTfulAPI(
    shutter_name,
    "POST",
    JSON.stringify({ action: action })
  );
  shutterStatusStore.shutterStatusState.shutters.set(
    result.shutter_name,
    result.state
  );
}

const onShutter1TurnON = async () => await shutterCommand("1", "ON");
const onShutter1TurnOFF = async () => await shutterCommand("1", "OFF");
const onShutter1Switch = async () => await shutterCommand("1", "SWITCH");
const onShutter2TurnON = async () => await shutterCommand("2", "ON");
const onShutter2TurnOFF = async () => await shutterCommand("2", "OFF");
const onShutter2Switch = async () => await shutterCommand("2", "SWITCH");
</script>
