<template>
  <a-layout style="padding: 0 24px 24px">
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: '16px 0',
        minHeight: '280px',
      }"
    >
      <a-typography>
        <a-typography-title :level="1">About</a-typography-title>
        <a-typography-paragraph>
          This application is part of the labctrl-widgetbox project, which is
          part of the labctrl project. Visit
          <a-typography-link href="https://labctrl.org">
            labctrl.org
          </a-typography-link>
          to get more information.
        </a-typography-paragraph>
        <a-typography-paragraph>
          The labctrl project is an open source progressive framework to build
          modern, robust and distributed laboratory controlling software, from
          hardware to GUI.
        </a-typography-paragraph>
        <a-typography-paragraph>
          labctrl-widgetbox is a submodule of labctrl that provides various GUI
          components to be integrated to a more complicated GUI application, see
          the framework architecture graph to get more information on how a
          labctrl app is built.
        </a-typography-paragraph>
      </a-typography>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Linear Stage WidgetBox ©2023 labctrl.org
    </a-layout-footer>
  </a-layout>
</template>
