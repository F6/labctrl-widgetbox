<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Control Panel</a-breadcrumb-item>
    <a-breadcrumb-item>Shutter Control</a-breadcrumb-item>
    <a-breadcrumb-item>Authentication</a-breadcrumb-item>
  </a-breadcrumb>
  <AuthenticationPageHeader />
  <br />
  <AuthenticationContent />
</template>

<script lang="ts" setup>
import AuthenticationPageHeader from "./Authentication/AuthenticationPageHeader.vue";
import AuthenticationContent from "./Authentication/AuthenticationContent.vue";
</script>
