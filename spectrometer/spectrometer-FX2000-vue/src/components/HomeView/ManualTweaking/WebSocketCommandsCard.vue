<template>
  <a-card title="WebSocket">
    <template #extra>
      <a-button
        @click="onFX2000SpectrometerWebsocketDisconnect"
        danger
        v-if="generic_sensor_websocket_status == WebSocketStatus.Connected"
      >
        Disconnect
      </a-button>
      <a-button
        type="primary"
        @click="onFX2000SpectrometerWebsocketConnect"
        v-else
      >
        Connect
      </a-button>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import { toRaw, computed } from "vue";
import { storeToRefs } from "pinia";

import { message as ant_message } from "ant-design-vue";
import {
  useConnectionStatusStore,
  useConnectionInfoStore,
  useWebSocketManagerStore,
  WebSocketStatus,
} from "@/store/connection";
import { useTokenStore } from "@/store/authentication";

const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };
const connInfoStore = useConnectionInfoStore();
const connStatusStore = useConnectionStatusStore();
const webSocketManagerStore = useWebSocketManagerStore();
const tokenStore = useTokenStore();
const { websocket_endpoint } = storeToRefs(connInfoStore);

const generic_sensor_websocket_status = computed(
  () =>
    connStatusStore.connStatusState.websockets.get(
      "websocket-spectrometer-fx2000"
    ) ?? WebSocketStatus.Unknown
);

function connectDeviceWebsocket(
  path: string,
  wsid: string,
  message_handler: (message: string) => void
) {
  const target_url = websocket_endpoint.value + path;
  console.log(
    "Connecting to device websocket with config: ",
    toRaw(connInfoStore.connInfoState.websocket)
  );
  console.log("Target WebSocket origin: ", target_url);
  try {
    // create the websocket connection.
    webSocketManagerStore.createNewWebSocket({
      wsid: wsid,
      url: target_url,
      on_open: function (this, ev) {
        console.log("websocket open", ev);
        connStatusStore.connStatusState.websockets.set(
          wsid,
          WebSocketStatus.Connected
        );
        // authenticate
        const auth_token = { token: tokenStore.token.jwt };
        this.send(JSON.stringify(auth_token));
      },
      on_close: function (this, ev) {
        console.log("websocket closed", ev);
        if (ev.wasClean) {
          connStatusStore.connStatusState.websockets.set(
            wsid,
            WebSocketStatus.Ready
          );
        } else {
          console.log("Websocket closed but not clean!");
          connStatusStore.connStatusState.websockets.set(
            wsid,
            WebSocketStatus.Error
          );
        }
      },
      on_error: function (this, ev) {
        console.log("websocket error", ev);
        connStatusStore.connStatusState.websockets.set(
          wsid,
          WebSocketStatus.Error
        );
      },
      on_message: function (this, ev) {
        message_handler(ev.data);
      },
    });
  } catch (error) {
    console.log(error);
  }
}

function disconnectDeviceWebsocket(wsid: string) {
  webSocketManagerStore.webSocketManagerState.websockets.get(wsid)?.close();
}

function FX2000SpectrometerWebSocketCommand(wsid: string, command: object) {
  const ws = webSocketManagerStore.webSocketManagerState.websockets.get(wsid);
  if (ws?.readyState == WebSocket.OPEN) {
    ws.send(JSON.stringify(command));
  } else {
    ant_message.warning(
      `WebSocket is not connected, current status: ${ws?.readyState}`
    );
  }
}

function FX2000SpectrometerWebSocketResponseHandler(message: string) {
  const result = JSON.parse(message);
  console.log(result);
}

const onFX2000SpectrometerWebsocketDisconnect = () =>
  disconnectDeviceWebsocket("websocket-spectrometer-fx2000");

const onFX2000SpectrometerWebsocketConnect = () =>
  connectDeviceWebsocket(
    "",
    "websocket-spectrometer-fx2000",
    FX2000SpectrometerWebSocketResponseHandler
  );
</script>

<style>
.plotly-plot {
  width: 100%;
  height: 400px;
}
</style>
