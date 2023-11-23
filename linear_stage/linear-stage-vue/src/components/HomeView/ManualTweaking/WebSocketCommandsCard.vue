<template>
  <a-card title="WebSocket Commands">
    <template #extra>
      <a-button
        @click="onLinearStageWebsocketDisconnect"
        danger
        v-if="linear_stage_websocket_status == WebSocketStatus.Connected"
      >
        Disconnect
      </a-button>
      <a-button type="primary" @click="onLinearStageWebsocketConnect" v-else>
        Connect
      </a-button>
    </template>
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
import {
  useLinearStageInputStore,
  useLinearStageStatusStore,
} from "@/store/manual_tweaking";
const linearStageInputStore = useLinearStageInputStore();
const linearStageStatusStore = useLinearStageStatusStore();
const { linearStageInputState } = storeToRefs(linearStageInputStore);
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };
const connInfoStore = useConnectionInfoStore();
const connStatusStore = useConnectionStatusStore();
const webSocketManagerStore = useWebSocketManagerStore();
const tokenStore = useTokenStore();
const { websocket_endpoint } = storeToRefs(connInfoStore);

const linear_stage_websocket_status = computed(
  () =>
    connStatusStore.connStatusState.websockets.get("websocket-linear-stage") ??
    WebSocketStatus.Unknown
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

function linearStageWebSocketCommand(wsid: string, command: object) {
  const ws = webSocketManagerStore.webSocketManagerState.websockets.get(wsid);
  if (ws?.readyState == WebSocket.OPEN) {
    ws.send(JSON.stringify(command));
  } else {
    ant_message.warning(
      `WebSocket is not connected, current status: ${ws?.readyState}`
    );
  }
}

function linearStageWebSocketResponseHandler(message: string) {
  const result = JSON.parse(message);
  console.log(result);
  if (result?.position) {
    linearStageStatusStore.linearStageStatusState.position.value =
      result.position.value;
  }
  if (result?.absolute_position) {
    linearStageStatusStore.linearStageStatusState.absolute_position.value =
      result.absolute_position.value;
    linearStageStatusStore.linearStageStatusState.absolute_position.unit =
      result.absolute_position.unit;
  }
  if (result?.velocity) {
    linearStageStatusStore.linearStageStatusState.velocity.value =
      result.velocity.value;
    linearStageStatusStore.linearStageStatusState.velocity.unit =
      result.velocity.unit;
  }
  if (result?.acceleration) {
    linearStageStatusStore.linearStageStatusState.acceleration.value =
      result.acceleration.value;
    linearStageStatusStore.linearStageStatusState.acceleration.unit =
      result.acceleration.unit;
  }
}

const onLinearStageWebsocketDisconnect = () =>
  disconnectDeviceWebsocket("websocket-linear-stage");

const onLinearStageWebsocketConnect = () =>
  connectDeviceWebsocket(
    "",
    "websocket-linear-stage",
    linearStageWebSocketResponseHandler
  );

async function onSetPosition() {
  const target_value =
    linearStageInputStore.linearStageInputState.position.value;
  console.log("Moving linear stage to position: ", target_value);
  linearStageWebSocketCommand("websocket-linear-stage", {
    position: { value: target_value },
  });
}

async function onSetAbsolutePosition() {
  const target = linearStageInputStore.linearStageInputState.absolute_position;
  console.log("Moving linear stage to absolute position: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    absolute_position: target,
  });
}

async function onSetVelocity() {
  const target = linearStageInputStore.linearStageInputState.velocity;
  console.log("Setting linear stage velocity: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    velocity: target,
  });
}

async function onSetAcceleration() {
  const target = linearStageInputStore.linearStageInputState.acceleration;
  console.log("Setting linear stage acceleration: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    acceleration: target,
  });
}
</script>
