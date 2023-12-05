<template>
  <a-page-header
    class="manual-tweaking-page-header"
    style="border: 1px solid rgb(235, 237, 240)"
    title="Manual Tweaking"
    sub-title="Sensor"
  >
    <template #extra>
      <a-button key="1" type="primary" @click="onSyncStatus">
        <SyncOutlined />
        Sync Status
      </a-button>
    </template>
    <a-descriptions
      size="small"
      :column="{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }"
    >
      <a-descriptions-item label="RESTful">
        <div class="restful-status-desc-box">
          <CloseCircleTwoTone
            two-tone-color="#ff0000"
            v-if="connStatusState.restful == RestfulStatus.Offline"
          />
          <CloseCircleTwoTone
            two-tone-color="#ff0000"
            v-else-if="connStatusState.restful == RestfulStatus.Error"
          />
          <WarningTwoTone
            two-tone-color="#eeaa00"
            v-else-if="connStatusState.restful == RestfulStatus.Unknown"
          />
          <CheckCircleTwoTone
            two-tone-color="#0000ff"
            v-else-if="connStatusState.restful == RestfulStatus.Online"
          />
          {{ connStatusState.restful }}
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="WebSocket">
        <div class="ws-status-desc-box">
          <CloseCircleTwoTone
            two-tone-color="#ff0000"
            v-if="test_websocket_status == WebSocketStatus.Error"
          />
          <WarningTwoTone
            two-tone-color="#eeaa00"
            v-else-if="test_websocket_status == WebSocketStatus.Unknown"
          />
          <CheckCircleTwoTone
            two-tone-color="#0000ff"
            v-else-if="test_websocket_status == WebSocketStatus.Ready"
          />
          <CheckCircleTwoTone
            two-tone-color="#52c41a"
            v-else-if="test_websocket_status == WebSocketStatus.Connected"
          />
          {{ test_websocket_status }}
        </div>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="gRPC">
        <div class="grpc-status-desc-box">
          <CloseCircleTwoTone
            two-tone-color="#ff0000"
            v-if="connStatusState.grpc == GRPCStatus.Offline"
          />
          <WarningTwoTone
            two-tone-color="#eeaa00"
            v-else-if="connStatusState.grpc == GRPCStatus.Unknown"
          />
          <CheckCircleTwoTone
            two-tone-color="#0000ff"
            v-else-if="connStatusState.grpc == GRPCStatus.Online"
          />
          {{ connStatusState.grpc }}
        </div>
      </a-descriptions-item> -->
      <a-descriptions-item label="Continuous Sampling">
        {{ genericSensorStatusStore.continous_sampling_mode_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Logical Temperature">
        {{ genericSensorStatusStore.temperature_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Logical Humidity">
        {{ genericSensorStatusStore.humidity_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Temperature">
        {{ genericSensorStatusStore.absolute_temperature_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Humidity">
        {{ genericSensorStatusStore.absolute_humidity_string }}
      </a-descriptions-item>
    </a-descriptions>
  </a-page-header>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import {
  WarningTwoTone,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SyncOutlined,
} from "@ant-design/icons-vue";
import {
  useConnectionStatusStore,
  RestfulStatus,
  WebSocketStatus,
} from "@/store/connection";
import { useGenericSensorStatusStore } from "@/store/generic_sensor";
import { callRESTfulAPI } from "@/common/connection";

const connStatusStore = useConnectionStatusStore();
const { connStatusState } = storeToRefs(connStatusStore);
const genericSensorStatusStore = useGenericSensorStatusStore();

const test_websocket_status = computed(
  () =>
    // When device supports multiple ws endpoints, this status should be synced with test-websocket only
    // but when there's only one ws endpoint, we directly tie this to the operating websocket
    // to make it more intuitive for the user.
    // connStatusState.value.websockets.get("test-websocket") ??
    // WebSocketStatus.Unknown
    connStatusState.value.websockets.get("websocket-sensor-generic") ??
    WebSocketStatus.Unknown
);

async function onSyncStatus() {
  // retrive current status of linear stage by GET
  await callRESTfulAPI("data", "GET", null).then((response) => {
    if (response) {
      genericSensorStatusStore.genericSensorStatusState.temperature.value =
        response.temperature.value;
      genericSensorStatusStore.genericSensorStatusState.absolute_temperature.value =
        response.absolute_temperature.value;
      genericSensorStatusStore.genericSensorStatusState.absolute_temperature.unit =
        response.absolute_temperature.unit;
      genericSensorStatusStore.genericSensorStatusState.humidity.value =
        response.humidity.value;
      genericSensorStatusStore.genericSensorStatusState.absolute_humidity.value =
        response.absolute_humidity.value;
      genericSensorStatusStore.genericSensorStatusState.absolute_humidity.unit =
        response.absolute_humidity.unit;
    }
  });
}
</script>

<style scoped>
.manual-tweaking-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
