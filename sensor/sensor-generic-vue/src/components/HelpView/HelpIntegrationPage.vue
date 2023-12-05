<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Help</a-breadcrumb-item>
    <a-breadcrumb-item>Integration</a-breadcrumb-item>
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
      <a-typography-title :level="2">How to Integrate</a-typography-title>
      <a-typography-paragraph>
        This application is part of the WidgetBox module of labctrl. It is
        designed to be able to work independently as a small standalone demo to
        control a device toolbox, but it can also be integrated into a larger
        application that does more than simple operations.
      </a-typography-paragraph>
      <a-typography-paragraph>
        To integrate a Vue3 widget or component into your project, you can
        directly copy the components and stores to your project. It is
        recommanded to copy all pages to the new project because they are all
        essential to control the device. Since vue projects share similar
        scaffolds, the only thing to do is to add the copied components to the
        new router of the new project.
      </a-typography-paragraph>
    </a-typography>
  </a-layout-content>
</template>
