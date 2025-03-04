import Vue from "vue";
import Router from "vue-router";
import DashboardLayout from "../layout/starter/SampleLayout.vue";
import Starter from "../layout/starter/SamplePage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/login",
      component: DashboardLayout,
      children: [
        {
          path: "login",
          name: "login",
          components: { default: Starter },
        },
      ],
    },
  ],
});
