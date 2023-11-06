<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Control Panel</a-breadcrumb-item>
    <a-breadcrumb-item>Shutter Control</a-breadcrumb-item>
    <a-breadcrumb-item>Manual Tweaking</a-breadcrumb-item>
  </a-breadcrumb>
  <ManualTweakingPageHeader />
  <br />
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <RestfulCommandsCard />
    <br />
    <WebSocketCommandsCard />
  </a-layout-content>
</template>

<script lang="ts" setup>
import ManualTweakingPageHeader from "./ManualTweaking/ManualTweakingPageHeader.vue";
import RestfulCommandsCard from "./ManualTweaking/RestfulCommandsCard.vue";
import WebSocketCommandsCard from "./ManualTweaking/WebSocketCommandsCard.vue";
</script>

<style scoped></style>
