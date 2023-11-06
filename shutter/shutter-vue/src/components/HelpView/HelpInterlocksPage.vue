<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Help</a-breadcrumb-item>
    <a-breadcrumb-item>Interlocks</a-breadcrumb-item>
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
      <a-typography-title :level="2">Interlock Settings</a-typography-title>
      <a-typography-paragraph>
        Interlocks are sets of rules to prevent the system to get into undesired
        or dangerous states. For example, in a vacuum chamber controlling
        program, opening the venting valve is not allowed if a high vacuum turbo
        pump is still running, and the venting valve is only allowed to open
        after the turbo pump is stopped. If the venting valve is opened with the
        turbo pump running, the turbo pump will blow up and cause danger.
        However, sometimes for debug or development purposes, we may need to
        temporarily disable such rules. This can be done from the
        <a-typography-text strong>Advanced - Interlocks</a-typography-text>
        panel.
      </a-typography-paragraph>
      <a-typography-paragraph>
        Direct manipulation of interlocks can be dangerous and if done
        incorrectly, may cause harm to instrument or people. And in most cases
        you will not need to do this. Thus it is put in Advanced section. When
        using any functionality in Advanced section, take extra care because the
        safety belt has been unbuckled.
      </a-typography-paragraph>
    </a-typography>
  </a-layout-content>
</template>
