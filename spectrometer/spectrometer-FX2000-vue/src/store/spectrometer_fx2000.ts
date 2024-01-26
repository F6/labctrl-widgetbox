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

export interface FX2000SpectrometerStatusState {
  // spectrometer parameters
  integration_time: AbsoluteQuantity;
  boxcar_width: LogicalQuantity;
  average_times: LogicalQuantity;
}

// This store is for current "spectrometer" status, which is synchronized with remote via RESTful or WebSocket
export const useFX2000SpectrometerStatusStore = defineStore(
  "spectrometer-fx2000-widgetbox-spectrometer-fx2000-status",
  () => {
    const FX2000SpectrometerStatusState: UnwrapRef<FX2000SpectrometerStatusState> =
      reactive({
        integration_time: { value: null, unit: "ms" },
        boxcar_width: { value: null },
        average_times: { value: null },
      });

    const integration_time_string = computed(() =>
      FX2000SpectrometerStatusState.integration_time.value === null
        ? "Unknown"
        : `${FX2000SpectrometerStatusState.integration_time.value.toFixed(4)} ${
            FX2000SpectrometerStatusState.integration_time.unit
          }`
    );

    const boxcar_width_string = computed(() =>
      FX2000SpectrometerStatusState.boxcar_width.value === null
        ? "Unknown"
        : `${FX2000SpectrometerStatusState.boxcar_width.value}`
    );

    const average_times_string = computed(() =>
      FX2000SpectrometerStatusState.average_times.value === null
        ? "Unknown"
        : `${FX2000SpectrometerStatusState.average_times.value}`
    );

    return {
      FX2000SpectrometerStatusState,
      integration_time_string,
      boxcar_width_string,
      average_times_string,
    };
  }
);

export interface FX2000SpectrometerPlotState {
  spectrum: {
    x: number[];
    y: number[];
    name: string;
    mode: string;
    line: {
      color: string;
    };
  };
}

export const useFX2000SpectrometerPlotStore = defineStore(
  "spectrometer-fx2000-widgetbox-spectrometer-fx2000-plot",
  () => {
    // Don't use reactive ref for storing large data arrays.
    // use shallowReactive makes sure only state.spectrum is reactive,
    // while state.spectrum.x or state.spectrum.y is not.
    const FX2000SpectrometerPlotState: ShallowReactive<FX2000SpectrometerPlotState> =
      shallowReactive({
        spectrum: {
          x: [],
          y: [],
          name: "Spectrum",
          mode: "lines",
          line: {
            color: "#1677ff",
          },
        },
      });

    const FX2000SpectrometerPlotConfig: UnwrapRef<Partial<Plotly.Config>> =
      reactive({
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
      });

    const FX2000SpectrometerSpectrumPlotLayout: UnwrapRef<
      Partial<Plotly.Layout>
    > = reactive({
      font: {
        family:
          "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
      },
      title: {
        x: 0.5,
        xref: "paper",
        text: "Spectrum",
        font: {
          size: 20,
        },
      },
      xaxis: {
        side: "bottom",
        type: "linear",
        ticks: "inside",
        title: {
          text: "Wavelength (nm)",
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
          text: "Intensity",
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

    const FX2000SpectrometerSpectrumPlot = ref<Plotly.Root>(
      "FX2000SpectrometerSpectrumPlot Placeholder"
    );

    return {
      FX2000SpectrometerPlotState,
      FX2000SpectrometerPlotConfig,
      FX2000SpectrometerSpectrumPlotLayout,
      FX2000SpectrometerSpectrumPlot,
    };
  }
);
