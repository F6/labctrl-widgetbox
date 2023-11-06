<template>
  <a-layout>
    <a-layout-sider
      width="220"
      style="background: #fff"
      v-model:collapsed="collapsed"
      collapsedWidth="60"
      collapsible
    >
      <a-menu
        v-model:selectedKeys="homeMenuSelectedKeys"
        v-model:openKeys="homeMenuOpenKeys"
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <a-sub-menu key="shutter-control">
          <template #title>
            <ExperimentOutlined />
            <span>Shutter Control</span>
          </template>
          <a-menu-item key="manual-tweaking-item">
            <ToolOutlined />
            <span>
              <router-link to="manual-tweaking">Manual Tweaking</router-link>
            </span>
          </a-menu-item>
          <a-menu-item key="authentication-item">
            <UnlockOutlined />
            <span>
              <router-link to="authentication">Authentication</router-link>
            </span>
          </a-menu-item>
          <a-menu-item key="connection-item">
            <LinkOutlined />
            <span>
              <router-link to="connection">Connection</router-link>
            </span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="advanced-settings">
          <template #title>
            <CodeOutlined />
            <span>Advanced</span>
          </template>
          <a-menu-item key="messages-item">
            <BugOutlined />
            <span>
              <router-link to="messages">Messages</router-link>
            </span>
          </a-menu-item>
          <a-menu-item key="interlocks-item">
            <StopOutlined />
            <span>
              <router-link to="interlocks">Interlocks</router-link>
            </span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <router-view />
      <a-layout-footer style="text-align: center">
        Shutter WidgetBox ©2023 labctrl.org
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ToolOutlined,
  UnlockOutlined,
  ExperimentOutlined,
  LinkOutlined,
  CodeOutlined,
  BugOutlined,
  StopOutlined,
} from "@ant-design/icons-vue";

const collapsed = ref<boolean>(false);
const homeMenuSelectedKeys = ref<string[]>(["manual-tweaking-item"]);
const homeMenuOpenKeys = ref<string[]>(["shutter-control"]);
</script>
