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
            style="width: calc(100% - 80px)"
            placeholder="vel"
          />
          <a-button @click="onSetVelocity" type="primary" style="width: 80px">
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Physical Velocity">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.physical_velocity.value"
            style="width: calc(100% - 180px)"
            placeholder="vel"
          />
          <a-select
            v-model:value="linearStageInputState.physical_velocity.unit"
            style="width: 100px"
          >
            <a-select-option value="m/s">m/s</a-select-option>
            <a-select-option value="mm/s">mm/s</a-select-option>
            <a-select-option value="um/s">um/s</a-select-option>
            <a-select-option value="nm/s">nm/s</a-select-option>
          </a-select>
          <a-button
            @click="onSetPhysicalVelocity"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Acceleration">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.acceleration.value"
            style="width: calc(100% - 80px)"
            placeholder="acc"
          />
          <a-button
            @click="onSetAcceleration"
            type="primary"
            style="width: 80px"
          >
            Set
          </a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="Physical Acceleration">
        <a-input-group compact>
          <a-input-number
            v-model:value="linearStageInputState.physical_acceleration.value"
            style="width: calc(100% - 200px)"
            placeholder="acc"
          />
          <a-select
            v-model:value="linearStageInputState.physical_acceleration.unit"
            style="width: 120px"
          >
            <a-select-option value="m/(s^2)">m/(s^2)</a-select-option>
            <a-select-option value="mm/(s^2)">mm/(s^2)</a-select-option>
            <a-select-option value="um/(s^2)">um/(s^2)</a-select-option>
            <a-select-option value="nm/(s^2)">nm/(s^2)</a-select-option>
          </a-select>
          <a-button
            @click="onSetPhysicalAcceleration"
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
          if (ev.code in [1002, 1008]) {
            // 1002 Protocol Error: indicates protocol errors.
            // 1008 Policy Violation: indicates errors for application, such as non-authorized.
            connStatusStore.connStatusState.websockets.set(
              wsid,
              WebSocketStatus.Error
            );
          } else {
            // 1005, 1000 and other status codes indicate normal disconnection.
            connStatusStore.connStatusState.websockets.set(
              wsid,
              WebSocketStatus.Ready
            );
          }
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
  if (result === null || result === undefined) {
    return;
  }
  if ("position" in result) {
    linearStageStatusStore.linearStageStatusState.position.value =
      result.position;
  }
  if ("velocity" in result) {
    linearStageStatusStore.linearStageStatusState.velocity.value =
      result.velocity;
  }
  if ("acceleration" in result) {
    linearStageStatusStore.linearStageStatusState.acceleration.value =
      result.acceleration;
  }
  if ("result" in result) {
    if (result.result !== "OK") {
      ant_message.warning(
        `WebSocket command warning: ${result.result}, check server log for more info.`
      );
    }
  }
  if ("error" in result) {
    ant_message.error(
      `WebSocket command error: ${result.error}, check server log for more info.`
    );
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
  const target_value = linearStageInputState.value.position.value;
  console.log("Moving linear stage to position: ", target_value);
  linearStageWebSocketCommand("websocket-linear-stage", {
    position: target_value,
  });
}

async function onSetAbsolutePosition() {
  const target = linearStageInputState.value.absolute_position;
  console.log("Moving linear stage to absolute position: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    position: target,
  });
}

async function onSetVelocity() {
  const target = linearStageInputState.value.velocity.value;
  console.log("Setting linear stage velocity: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    velocity: target,
  });
}

async function onSetPhysicalVelocity() {
  const target = linearStageInputState.value.physical_velocity;
  console.log("Setting linear stage physical velocity: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    velocity: target,
  });
}

async function onSetAcceleration() {
  const target = linearStageInputState.value.acceleration.value;
  console.log("Setting linear stage acceleration: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    acceleration: target,
  });
}

async function onSetPhysicalAcceleration() {
  const target = linearStageInputState.value.physical_acceleration;
  console.log("Setting linear stage physical acceleration: ", target);
  linearStageWebSocketCommand("websocket-linear-stage", {
    acceleration: target,
  });
}
</script>
