import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ManualTweakingPage from "@/components/HomeView/ManualTweakingPage.vue";
import AuthenticationPage from "@/components/HomeView/AuthenticationPage.vue";
import ConnectionPage from "@/components/HomeView/ConnectionPage.vue";
import MessagesPage from "@/components/HomeView/MessagesPage.vue";
import InterlocksPage from "@/components/HomeView/InterlocksPage.vue";
import HelpView from "@/views/HelpView.vue";
import HelpControlPage from "@/components/HelpView/HelpControlPage.vue";
import HelpAuthenticationPage from "@/components/HelpView/HelpAuthenticationPage.vue";
import HelpConnectionPage from "@/components/HelpView/HelpConnectionPage.vue";
import HelpInterlocksPage from "@/components/HelpView/HelpInterlocksPage.vue";
import HelpIntegrationPage from "@/components/HelpView/HelpIntegrationPage.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: { path: "/manual-tweaking" },
    component: HomeView,
    children: [
      {
        path: "/manual-tweaking",
        component: ManualTweakingPage,
      },
      {
        path: "/authentication",
        component: AuthenticationPage,
      },
      {
        path: "/connection",
        component: ConnectionPage,
      },
      {
        path: "/messages",
        component: MessagesPage,
      },
      {
        path: "/interlocks",
        component: InterlocksPage,
      },
    ],
  },
  {
    path: "/help",
    name: "help",
    redirect: { path: "/help/control" },
    component: HelpView,
    children: [
      {
        path: "/help/control",
        component: HelpControlPage,
      },
      {
        path: "/help/authentication",
        component: HelpAuthenticationPage,
      },
      {
        path: "/help/connection",
        component: HelpConnectionPage,
      },
      {
        path: "/help/interlocks",
        component: HelpInterlocksPage,
      },
      {
        path: "/help/integration",
        component: HelpIntegrationPage,
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
