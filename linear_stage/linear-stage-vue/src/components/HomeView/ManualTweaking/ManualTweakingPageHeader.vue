<template>
  <a-page-header
    class="manual-tweaking-page-header"
    style="border: 1px solid rgb(235, 237, 240)"
    title="Manual Tweaking"
    sub-title="Linear Stage"
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
      <a-descriptions-item label="Position">
        {{ linearStageStatusStore.position_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Absolute Position">
        {{ linearStageStatusStore.absolute_position_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Velocity">
        {{ linearStageStatusStore.velocity_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Physical Velocity">
        {{ linearStageStatusStore.physical_velocity_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Acceleration">
        {{ linearStageStatusStore.acceleration_string }}
      </a-descriptions-item>
      <a-descriptions-item label="Physical Acceleration">
        {{ linearStageStatusStore.physical_acceleration_string }}
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
import { useLinearStageStatusStore } from "@/store/manual_tweaking";
import { callRESTfulAPI } from "@/common/connection";

const connStatusStore = useConnectionStatusStore();
const { connStatusState } = storeToRefs(connStatusStore);
const linearStageStatusStore = useLinearStageStatusStore();

const test_websocket_status = computed(
  () =>
    // When device supports multiple ws endpoints, this status should be synced with test-websocket only
    // but when there's only one ws endpoint, we directly tie this to the operating websocket
    // to make it more intuitive for the user.
    // connStatusState.value.websockets.get("test-websocket") ??
    // WebSocketStatus.Unknown
    connStatusState.value.websockets.get("websocket-linear-stage") ??
    WebSocketStatus.Unknown
);

async function onSyncStatus() {
  // retrive current status of linear stage by GET
  await callRESTfulAPI("position", "GET", null).then((response) => {
    if (response) {
      linearStageStatusStore.linearStageStatusState.position.value =
        response.value;
    }
  });
  await callRESTfulAPI("absolute_position", "GET", null).then((response) => {
    if (response) {
      linearStageStatusStore.linearStageStatusState.absolute_position.value =
        response.value;
      linearStageStatusStore.linearStageStatusState.absolute_position.unit =
        response.unit;
    }
  });
  await callRESTfulAPI("parameter/velocity", "GET", null).then((response) => {
    if (response) {
      linearStageStatusStore.linearStageStatusState.velocity.value =
        response.value;
      linearStageStatusStore.linearStageStatusState.physical_velocity.value =
        response.value * response.unit_step.value;
      linearStageStatusStore.linearStageStatusState.physical_velocity.unit =
        response.unit_step.unit;
    }
  });
  await callRESTfulAPI("parameter/acceleration", "GET", null).then(
    (response) => {
      if (response) {
        linearStageStatusStore.linearStageStatusState.acceleration.value =
          response.value;
        linearStageStatusStore.linearStageStatusState.physical_acceleration.value =
          response.value * response.unit_step.value;
        linearStageStatusStore.linearStageStatusState.physical_acceleration.unit =
          response.unit_step.unit;
      }
    }
  );
}
</script>

<style scoped>
.manual-tweaking-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
