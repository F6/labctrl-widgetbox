import Plotly from "plotly.js";
import { defineStore } from "pinia";
import { RemovableRef, useStorage } from "@vueuse/core";
import {
  ref,
  computed,
  UnwrapRef,
  reactive,
  shallowReactive,
  ShallowReactive,
} from "vue";
import { LogicalQuantity, AbsoluteQuantity } from "@/common/unit";

export interface GenericSensorStatusState {
  // sensor mode
  continous_sampling_mode: boolean | null;
  // sensor states
  absolute_temperature: AbsoluteQuantity;
  absolute_humidity: AbsoluteQuantity;
  temperature: LogicalQuantity;
  humidity: LogicalQuantity;
  // sensor parameters
  temperature_sampling_interval: AbsoluteQuantity;
  humidity_sampling_interval: AbsoluteQuantity;
}

// This store is for current "generic sensor" status, which is synchronized with remote via RESTful or WebSocket
export const useGenericSensorStatusStore = defineStore(
  "sensor-generic-widgetbox-sensor-generic-status",
  () => {
    const genericSensorStatusState: UnwrapRef<GenericSensorStatusState> =
      reactive({
        continous_sampling_mode: null,
        absolute_temperature: { value: null, unit: "K" },
        absolute_humidity: { value: null, unit: "mm" },
        temperature: { value: null },
        humidity: { value: null },
        temperature_sampling_interval: { value: null, unit: "ms" },
        humidity_sampling_interval: { value: null, unit: "ms" },
      });

    const continous_sampling_mode_string = computed(() =>
      genericSensorStatusState.continous_sampling_mode === null
        ? "Unknown"
        : genericSensorStatusState.continous_sampling_mode
        ? "ON"
        : "OFF"
    );

    const temperature_string = computed(() =>
      genericSensorStatusState.temperature.value === null
        ? "Unknown"
        : `${genericSensorStatusState.temperature.value}`
    );

    const absolute_temperature_string = computed(() =>
      genericSensorStatusState.absolute_temperature.value === null
        ? "Unknown"
        : `${genericSensorStatusState.absolute_temperature.value.toFixed(4)} ${
            genericSensorStatusState.absolute_temperature.unit
          }`
    );

    const humidity_string = computed(() =>
      genericSensorStatusState.humidity.value === null
        ? "Unknown"
        : `${genericSensorStatusState.humidity.value}`
    );

    const absolute_humidity_string = computed(() =>
      genericSensorStatusState.absolute_humidity.value === null
        ? "Unknown"
        : `${genericSensorStatusState.absolute_humidity.value.toFixed(4)} ${
            genericSensorStatusState.absolute_humidity.unit
          }`
    );

    return {
      genericSensorStatusState,
      continous_sampling_mode_string,
      temperature_string,
      absolute_temperature_string,
      humidity_string,
      absolute_humidity_string,
    };
  }
);

export interface GenericSensorPlotState {
  temperature: {
    x: Date[];
    y: number[];
    name: string;
    mode: string;
    line: {
      color: string;
    };
  };
  humidity: {
    x: Date[];
    y: number[];
    name: string;
    mode: string;
    line: {
      color: string;
    };
  };
}

export const useGenericSensorPlotStore = defineStore(
  "sensor-generic-widgetbox-sensor-generic-plot",
  () => {
    // Don't use reactive ref for storing large data arrays.
    // use shallowReactive makes sure only state.temperature and state.humidity is reactive,
    // while state.temperature.x or state.temperature.y is not.
    const genericSensorPlotState: ShallowReactive<GenericSensorPlotState> =
      shallowReactive({
        temperature: {
          x: [],
          y: [],
          name: "Temperature",
          mode: "lines",
          line: {
            color: "#1677ff",
          },
        },
        humidity: {
          x: [],
          y: [],
          name: "Humidity",
          mode: "lines",
          line: {
            color: "#1677ff",
          },
        },
      });

    const genericSensorPlotConfig: UnwrapRef<Partial<Plotly.Config>> = reactive(
      {
        responsive: true,
        editable: true,
        displaylogo: false,
        toImageButtonOptions: {
          format: "svg", // one of png, svg, jpeg, webp
          filename: "labctrl_exported_plot",
          // height: 500,
          // width: 700,
          scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        },
      }
    );

    const genericSensorTemperaturePlotLayout: UnwrapRef<
      Partial<Plotly.Layout>
    > = reactive({
      font: {
        family:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
      },
      title: {
        x: 0.5,
        xref: "paper",
        text: "Sensor Data Log",
        font: {
          size: 20,
        },
      },
      xaxis: {
        side: "bottom",
        type: "date",
        ticks: "inside",
        title: {
          text: "Time",
        },
        mirror: "ticks",
        showgrid: true,
        showline: true,
        tickmode: "auto",
        autorange: true,
        gridwidth: 1,
        linecolor: "rgb(0, 0, 0)",
        linewidth: 2,
        tickwidth: 2,
        showspikes: false,
        tickformat: "",
        zerolinewidth: 2,
        spikethickness: 3,
      },
      yaxis: {
        side: "bottom",
        type: "linear",
        ticks: "inside",
        title: {
          text: "Temperature",
        },
        mirror: "ticks",
        showgrid: true,
        showline: true,
        tickmode: "auto",
        autorange: true,
        gridwidth: 1,
        linecolor: "rgb(0, 0, 0)",
        linewidth: 2,
        tickwidth: 2,
        showspikes: false,
        tickformat: "",
        zerolinewidth: 2,
        spikethickness: 3,
      },
      legend: {
        x: 0.05,
        y: 0.95,
        font: {
          size: 14,
        },
        xanchor: "auto",
        borderwidth: 2,
      },
      margin: {
        // b: 40,
        // l: 40,
        r: 10,
        t: 40,
      },
      autosize: true,
      showlegend: true,
    });

    const genericSensorHumidityPlotLayout: UnwrapRef<Partial<Plotly.Layout>> =
      reactive({
        font: {
          family:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
        },
        title: {
          x: 0.5,
          xref: "paper",
          text: "Sensor Data Log",
          font: {
            size: 20,
          },
        },
        xaxis: {
          side: "bottom",
          type: "date",
          ticks: "inside",
          title: {
            text: "Time",
          },
          mirror: "ticks",
          showgrid: true,
          showline: true,
          tickmode: "auto",
          autorange: true,
          gridwidth: 1,
          linecolor: "rgb(0, 0, 0)",
          linewidth: 2,
          tickwidth: 2,
          showspikes: false,
          tickformat: "",
          zerolinewidth: 2,
          spikethickness: 3,
        },
        yaxis: {
          side: "bottom",
          type: "linear",
          ticks: "inside",
          title: {
            text: "Humidity",
          },
          mirror: "ticks",
          showgrid: true,
          showline: true,
          tickmode: "auto",
          autorange: true,
          gridwidth: 1,
          linecolor: "rgb(0, 0, 0)",
          linewidth: 2,
          tickwidth: 2,
          showspikes: false,
          tickformat: "",
          zerolinewidth: 2,
          spikethickness: 3,
        },
        legend: {
          x: 0.05,
          y: 0.95,
          font: {
            size: 14,
          },
          xanchor: "auto",
          borderwidth: 2,
        },
        margin: {
          // b: 40,
          // l: 40,
          r: 10,
          t: 40,
        },
        autosize: true,
        showlegend: true,
      });

    const genericSensorTemperaturePlot = ref<Plotly.Root>(
      "genericSensorTemperatureDataPlot Placeholder"
    );

    const genericSensorHumidityPlot = ref<Plotly.Root>(
      "genericSensorHumidityDataPlot Placeholder"
    );

    return {
      genericSensorPlotState,
      genericSensorPlotConfig,
      genericSensorTemperaturePlotLayout,
      genericSensorHumidityPlotLayout,
      genericSensorTemperaturePlot,
      genericSensorHumidityPlot,
    };
  }
);
