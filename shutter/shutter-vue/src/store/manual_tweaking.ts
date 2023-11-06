import { defineStore } from "pinia";
import { UnwrapRef, reactive } from "vue";

export enum ShutterStatus {
  ON = "ON",
  OFF = "OFF",
  Unknown = "Unknown",
}

export interface ShutterStatusState {
  shutters: Map<string, ShutterStatus>;
}

export const useShutterStatusStore = defineStore(
  "shutter-widgetbox-shutter-status",
  () => {
    const shutterStatusState: UnwrapRef<ShutterStatusState> = reactive({
      shutters: new Map(),
    });
    return { shutterStatusState };
  }
);
