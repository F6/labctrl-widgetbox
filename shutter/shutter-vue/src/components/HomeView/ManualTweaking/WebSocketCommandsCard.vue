<template>
  <a-card title="WebSocket Commands">
    <a-row :gutter="[16, 8]">
      <a-col>
        <a-card title="Shutter 1">
          <template #extra>
            <a-button
              @click="onShutter1WebsocketDisconnect"
              danger
              v-if="ws_shutter_1_status == WebSocketStatus.Connected"
            >
              Disconnect
            </a-button>
            <a-button type="primary" @click="onShutter1WebsocketConnect" v-else>
              Connect
            </a-button>
          </template>
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
          <template #extra>
            <a-button
              @click="onShutter2WebsocketDisconnect"
              danger
              v-if="ws_shutter_2_status == WebSocketStatus.Connected"
            >
              Disconnect
            </a-button>
            <a-button type="primary" @click="onShutter2WebsocketConnect" v-else>
              Connect
            </a-button>
          </template>
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
import { toRaw, computed } from "vue";
import { storeToRefs } from "pinia";
import {
  useConnectionStatusStore,
  useConnectionInfoStore,
  useWebSocketManagerStore,
  WebSocketStatus,
} from "@/store/connection";
import { useTokenStore } from "@/store/authentication";
import { useShutterStatusStore } from "@/store/manual_tweaking";

const connInfoStore = useConnectionInfoStore();
const connStatusStore = useConnectionStatusStore();
const webSocketManagerStore = useWebSocketManagerStore();
const tokenStore = useTokenStore();
const { websocket_endpoint } = storeToRefs(connInfoStore);
const shutterStatusStore = useShutterStatusStore();

const ws_shutter_1_status = computed(
  () =>
    connStatusStore.connStatusState.websockets.get("websocket-shutter-1") ??
    WebSocketStatus.Unknown
);

const ws_shutter_2_status = computed(
  () =>
    connStatusStore.connStatusState.websockets.get("websocket-shutter-2") ??
    WebSocketStatus.Unknown
);

function connectShutterWebsocket(
  path: string,
  wsid: string,
  message_handler: (message: string) => void
) {
  const target_url = websocket_endpoint.value + path;
  console.log(
    "Connecting to Shutter websocket with config: ",
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

function disconnectShutterWebsocket(wsid: string) {
  webSocketManagerStore.webSocketManagerState.websockets.get(wsid)?.close();
}

function shutterCommand(wsid: string, command: string) {
  const ws = webSocketManagerStore.webSocketManagerState.websockets.get(wsid);
  if (!ws) return;
  const command_body = { action: command };
  ws.send(JSON.stringify(command_body));
}

function shutterResponseHandler(message: string) {
  const result = JSON.parse(message);
  if (result) {
    shutterStatusStore.shutterStatusState.shutters.set(
      result.shutter_name,
      result.state
    );
  }
}

const onShutter1WebsocketDisconnect = () =>
  disconnectShutterWebsocket("websocket-shutter-1");

const onShutter1WebsocketConnect = () =>
  connectShutterWebsocket("1", "websocket-shutter-1", shutterResponseHandler);

const onShutter1TurnON = () => shutterCommand("websocket-shutter-1", "ON");
const onShutter1TurnOFF = () => shutterCommand("websocket-shutter-1", "OFF");
const onShutter1Switch = () => shutterCommand("websocket-shutter-1", "SWITCH");

const onShutter2WebsocketDisconnect = () =>
  disconnectShutterWebsocket("websocket-shutter-2");

const onShutter2WebsocketConnect = () =>
  connectShutterWebsocket("2", "websocket-shutter-2", shutterResponseHandler);

const onShutter2TurnON = () => shutterCommand("websocket-shutter-2", "ON");
const onShutter2TurnOFF = () => shutterCommand("websocket-shutter-2", "OFF");
const onShutter2Switch = () => shutterCommand("websocket-shutter-2", "SWITCH");
</script>
