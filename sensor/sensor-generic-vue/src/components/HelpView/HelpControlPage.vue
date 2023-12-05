<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Help</a-breadcrumb-item>
    <a-breadcrumb-item>Control</a-breadcrumb-item>
  </a-breadcrumb>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <a-typography>
      <a-typography-title :level="2">Controlling Devices</a-typography-title>
      <a-typography-paragraph>
        To control a device, you need to setup the device controlling API server
        first. Once the API server is up and running, fill in connection
        settings in
        <a-typography-text strong>Control Panel - Connection</a-typography-text>
        and click on "Test" to check if the remote device server is accessable
        from local computer. The connection information only needs to be filled
        in once and is automatically stored locally. The next time you opens
        this page, it is automatically loaded from localStorage for you. After
        connection is tested OK, head over to
        <a-typography-text strong>
          Control Panel - Authentication
        </a-typography-text>
        to request a new Access Token. The Access Token is required by the
        remote API server to prevent unauthorized clients from operating your
        device. The Access Token is also stored locally so that you don't need
        to login again every time you open this app. Once the access token is
        validated, you can now go to
        <a-typography-text strong>
          Control Panel - Manual Tweaking
        </a-typography-text>
        to control your device.
      </a-typography-paragraph>
      <a-typography-paragraph>
        Check Authentication and Connection Help pages for more information on
        how to setup remote device settings and auth.
      </a-typography-paragraph>
      <a-typography-title :level="3">RESTful Commands</a-typography-title>
      <a-typography-paragraph>
        The RESTful Commands are asynchronous API calls over HTTP/HTTPS.
        Asynchronous means no blocking or waiting is required. The client just
        tells the remote device to perform the command and it will not wait the
        command to finish. This is useful when you can directly see the device
        in action or want to perform multiple tasks and don't care about the
        timing and order of commands.
      </a-typography-paragraph>
      <a-typography-paragraph>
        When using asynchronous commands, it is also possible to check the
        status or result of command execution by polling the corresponding
        resource. For this app, local status is automatically managed for you,
        but in case that other clients operated the remote device, the change of
        state is not captured by this client app if websocket is not connected.
        Because the server cannot actively push message to its client when using
        RESTful protocol, there's no way that the app can know the remote server
        changes if not actively polled. In that case, you can use Sync Status
        button to manually update local status.
      </a-typography-paragraph>
      <a-typography-paragraph>
        RESTful APIs are connection-less and proxiable. You can make as many
        requests to the same API Endpoint at the same time as you like. If the
        server cannot find a way to fullfill your request, it will report the
        issue in returned response. You can also fire requests through multiple
        different network gateways/paths if the connection might by unstable. No
        request needs to depend on a previous request.
      </a-typography-paragraph>
      <a-typography-title :level="3">WebSocket Commands</a-typography-title>
      <a-typography-paragraph>
        The WebSocket API can be used to control the device if timing or order
        of command execution is critical. The WebSocket API is a real-time API
        that executes commands with no delay, and the server will push the
        finishing message to client as soon as command execution completes, so
        no polling delay is introduced. So the overall operating efficiency is
        better when using WebSocket API. The WebSocket API is also more similar
        to the traditional command-and-response pattern for controlling devices.
        Because the connection is only authenticated once when it starts, the
        authentication overhead is also smaller.
      </a-typography-paragraph>
      <a-typography-paragraph>
        Major drawbacks of the WebSocket API is that it is connection-based,
        which can be interrupted if network changes, and the client must re-dial
        the connection each time the network re-connects. It is also inherently
        synchronous, so the client needs to manage asynchronous states by itself
        if the client wants to perform multiple tasks in parallel.
      </a-typography-paragraph>
      <a-typography-title :level="3">gRPC Commands</a-typography-title>
      <a-typography-paragraph>
        The gRPC API is used to handle heavy-load tasks on distributed system.
        It is only used for high-speed and high-performance devices. There's no
        such command in this app yet.
      </a-typography-paragraph>
      <a-typography-title :level="3">Additional Notes</a-typography-title>
      <a-typography-paragraph>
        All controlling elements such as buttons/toggles are colored according
        to the following rules:
      </a-typography-paragraph>
      <a-typography-paragraph>
        <ul>
          <li>
            If the operation is expected to not trigger any change of state, it
            is colored white. For example, exporting a config file will only
            download a file to local computer, thus export buttons are white.
            White buttons are safe to click at any time.
          </li>
          <li>
            If the operation will trigger a change of data state, it is colored
            blue. For example requesting a new token or connecting to a
            websocket. Blue buttons are safe to click in general because they
            only manipulate data, not real world stuff.
          </li>
          <li>
            If the operation will trigger a change of device state, it is
            colored orange. For example switching a shutter or turning on a
            ceiling light. Orange buttons trigger real-world actions, they are
            like real switches on the wall or buttons on the machine, and you
            must be careful.
          </li>
          <li>
            If the operation triggers some irreversible action, it is colored
            white but with red text and border. For example deleting a saved
            token or disconnecting from remote websocket. The color pattern
            means danger, so you should think twice before clicking.
          </li>
          <li>
            If the operation causes danger in the real world, it is colored red.
            For example starting a high-power motor. These buttons will pop-up a
            confirmation box before execution.
          </li>
          <li>
            Green buttons trigger long tasks/routines. The task may include
            dangerous moves and may cause a lot of data/device state changes. So
            it is basically red button, orange button, white button and blue
            button added up together. It is green only because that is a good
            color to indicate task start (contrast to a stop button which is
            typically red-texted), not because it is safe to click.
          </li>
          <li>
            Cyan buttons are buttons with special functionalities, for example
            pausing other actions or trigger a special debug behaviour.
          </li>
        </ul>
      </a-typography-paragraph>
    </a-typography>
    <a-card title="Button Types">
      <a-row :gutter="[16, 8]">
        <a-col>
          <a-button type="default" @click="onWhiteButtonClick">
            No Consequences
          </a-button>
        </a-col>
        <a-col>
          <a-button type="primary" @click="onBlueButtonClick">
            {{ blue_button_text }}
          </a-button>
        </a-col>
        <a-col>
          <a-button
            type="primary"
            style="background-color: #f0ad4e"
            @click="onOrangeButtonClick"
          >
            Real World Action
          </a-button>
        </a-col>
        <a-col>
          <a-button type="default" danger @click="onDangerButtonClick">
            {{ danger_button_text }}
          </a-button>
        </a-col>
        <a-col>
          <a-button type="primary" danger @click="onRedButtonClick">
            Dangerous Action
          </a-button>
          <a-modal
            v-model:open="red_button_confirm_open"
            title="Are you sure?"
            okText="YES!"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <p>This button clearly says "Dangerous Action".</p>
            <p>Are you sure you want to push the button?</p>
          </a-modal>
        </a-col>
        <a-col>
          <a-button type="primary" style="background-color: #5cb85c">
            Long Task
          </a-button>
        </a-col>
        <a-col>
          <a-button type="primary" style="background-color: #5bc0de">
            Special
          </a-button>
        </a-col>
      </a-row>
    </a-card>
  </a-layout-content>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { ref } from "vue";

const no_consequence_texts = [
  "Click again!",
  "Click more!",
  "Just click it!",
  "Click it!",
  "Cookie clicker!",
];

const onWhiteButtonClick = () => {
  message.info(
    no_consequence_texts[
      Math.floor(Math.random() * no_consequence_texts.length)
    ]
  );
};

const blue_button_text = ref<string>("Change Data");
const onBlueButtonClick = () => {
  if (blue_button_text.value == "Change Data") {
    blue_button_text.value = "Data Change";
  } else {
    blue_button_text.value = "Change Data";
  }
};

const onOrangeButtonClick = () => {
  message.info("Imagine your room light is now turned on/off");
};

const danger_button_text = ref<string>("Irreversible");
const onDangerButtonClick = () => {
  danger_button_text.value = "I told you";
};

const red_button_confirm_open = ref<boolean>(false);

const showModal = () => {
  red_button_confirm_open.value = true;
};

const handleOk = () => {
  red_button_confirm_open.value = false;
  message.warn("Imagine your lab just blew up.");
};

const handleCancel = () => {
  red_button_confirm_open.value = false;
  message.info("You are clever.");
};

const onRedButtonClick = () => {
  showModal();
};
</script>
