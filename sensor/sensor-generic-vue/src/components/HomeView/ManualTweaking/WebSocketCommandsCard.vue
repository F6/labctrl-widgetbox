<template>
  <a-card title="WebSocket">
    <template #extra>
      <a-button
        @click="onGenericSensorWebsocketDisconnect"
        danger
        v-if="generic_sensor_websocket_status == WebSocketStatus.Connected"
      >
        Disconnect
      </a-button>
      <a-button type="primary" @click="onGenericSensorWebsocketConnect" v-else>
        Connect
      </a-button>
    </template>
    <div ref="genericSensorTemperaturePlot" class="plotly-plot"></div>
    <div ref="genericSensorHumidityPlot" class="plotly-plot"></div>
  </a-card>
</template>

<script lang="ts" setup>
import { toRaw, computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Plotly from "plotly.js";
import { message as ant_message } from "ant-design-vue";
import {
  useConnectionStatusStore,
  useConnectionInfoStore,
  useWebSocketManagerStore,
  WebSocketStatus,
} from "@/store/connection";
import { useTokenStore } from "@/store/authentication";
import { useGenericSensorParameterInputStore } from "@/store/manual_tweaking";
import {
  useGenericSensorStatusStore,
  useGenericSensorPlotStore,
} from "@/store/generic_sensor";

const genericSensorParameterInputStore = useGenericSensorParameterInputStore();
const genericSensorStatusStore = useGenericSensorStatusStore();
const genericSensorPlotStore = useGenericSensorPlotStore();
const { genericSensorParameterInputState } = storeToRefs(
  genericSensorParameterInputStore
);
const {
  genericSensorPlotState,
  genericSensorPlotConfig,
  genericSensorTemperaturePlotLayout,
  genericSensorHumidityPlotLayout,
  genericSensorTemperaturePlot,
  genericSensorHumidityPlot,
} = storeToRefs(genericSensorPlotStore);
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
      "websocket-sensor-generic"
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

function genericSensorWebSocketCommand(wsid: string, command: object) {
  const ws = webSocketManagerStore.webSocketManagerState.websockets.get(wsid);
  if (ws?.readyState == WebSocket.OPEN) {
    ws.send(JSON.stringify(command));
  } else {
    ant_message.warning(
      `WebSocket is not connected, current status: ${ws?.readyState}`
    );
  }
}

function genericSensorWebSocketResponseHandler(message: string) {
  const result = JSON.parse(message);
  const data_t = new Date();
  // console.log(result);
  if (result?.temperature) {
    const data_y = result.temperature;
    genericSensorStatusStore.genericSensorStatusState.temperature.value =
      data_y;
    genericSensorPlotState.value.temperature.x.push(data_t);
    genericSensorPlotState.value.temperature.y.push(data_y);
    // check if the temperature plot is currently drawn on screen,
    // ask for a render only if the element exists to save GPU resources.
    if (genericSensorTemperaturePlot.value) {
      Plotly.extendTraces(
        genericSensorTemperaturePlot.value,
        { x: [[data_t]], y: [[data_y]] },
        [0]
      );
    }
  }
  if (result?.humidity) {
    const data_y = result.humidity;
    genericSensorStatusStore.genericSensorStatusState.humidity.value = data_y;
    genericSensorPlotState.value.humidity.x.push(data_t);
    genericSensorPlotState.value.humidity.y.push(data_y);
    // check if the humidity plot is currently drawn on screen,
    // ask for a render only if the element exists to save GPU resources.
    if (genericSensorHumidityPlot.value) {
      Plotly.extendTraces(
        genericSensorHumidityPlot.value,
        { x: [[data_t]], y: [[data_y]] },
        [0]
      );
    }
  }
}

const onGenericSensorWebsocketDisconnect = () =>
  disconnectDeviceWebsocket("websocket-sensor-generic");

const onGenericSensorWebsocketConnect = () =>
  connectDeviceWebsocket(
    "",
    "websocket-sensor-generic",
    genericSensorWebSocketResponseHandler
  );

// When user navigates to other views, the plot is destroyed
//  and no longer renders updates to save CPU/GPU resources.
// When user switches back to this page, we recreate the plot
//  according to our newest data when the element is mounted.
onMounted(() => {
  Plotly.newPlot(
    genericSensorTemperaturePlot.value,
    [genericSensorPlotState.value.temperature],
    genericSensorTemperaturePlotLayout.value,
    genericSensorPlotConfig.value
  );
  Plotly.newPlot(
    genericSensorHumidityPlot.value,
    [genericSensorPlotState.value.humidity],
    genericSensorHumidityPlotLayout.value,
    genericSensorPlotConfig.value
  );
});
</script>

<style>
.plotly-plot {
  width: 100%;
  height: 400px;
}
</style>
