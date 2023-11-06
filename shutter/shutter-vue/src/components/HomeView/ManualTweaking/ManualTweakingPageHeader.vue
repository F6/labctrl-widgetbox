<template>
  <a-page-header
    class="manual-tweaking-page-header"
    style="border: 1px solid rgb(235, 237, 240)"
    title="Manual Tweaking"
    sub-title="Shutter States"
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
      <a-descriptions-item label="gRPC">
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
      </a-descriptions-item>
      <a-descriptions-item label="Shutter 1">
        {{ shutter_1_status }}
      </a-descriptions-item>
      <a-descriptions-item label="Shutter 2">
        {{ shutter_2_status }}
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
  GRPCStatus,
} from "@/store/connection";
import { ShutterStatus, useShutterStatusStore } from "@/store/manual_tweaking";
import { callRESTfulAPI } from "@/common/connection";

const connStatusStore = useConnectionStatusStore();
const { connStatusState } = storeToRefs(connStatusStore);
const shutterStatusStore = useShutterStatusStore();

const test_websocket_status = computed(
  () =>
    connStatusState.value.websockets.get("test-websocket") ??
    WebSocketStatus.Unknown
);

const shutter_1_status = computed(
  () =>
    shutterStatusStore.shutterStatusState.shutters.get("1") ??
    ShutterStatus.Unknown
);

const shutter_2_status = computed(
  () =>
    shutterStatusStore.shutterStatusState.shutters.get("2") ??
    ShutterStatus.Unknown
);

async function onSyncStatus() {
  // GET on shutters will return its status
  const shutter_names = ["1", "2"];
  for (var shutter_name of shutter_names) {
    const result = await callRESTfulAPI(shutter_name, "GET", null);
    shutterStatusStore.shutterStatusState.shutters.set(
      result.shutter_name,
      result.state
    );
  }
}
</script>

<style scoped>
.manual-tweaking-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
