<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36" />
        <sidebar-link to="/roles" :name="$t('sidebar.roles')" icon="tim-icons icon-settings" />
        <sidebar-link to="/divisions" :name="$t('sidebar.divisions')" icon="tim-icons icon-istanbul" />
        <sidebar-link to="/employees" :name="$t('sidebar.employees')" icon="tim-icons icon-single-02" />
        <sidebar-link to="/icons" :name="$t('sidebar.icons')" icon="tim-icons icon-atom" />
        <!-- <sidebar-link
          to="/maps"
          :name="$t('sidebar.maps')"
          icon="tim-icons icon-pin"
        />
        <sidebar-link
          to="/notifications"
          :name="$t('sidebar.notifications')"
          icon="tim-icons icon-bell-55"
        />
        <sidebar-link
          to="/profile"
          :name="$t('sidebar.userProfile')"
          icon="tim-icons icon-single-02"
        />
        <sidebar-link
          to="/typography"
          :name="$t('sidebar.typography')"
          icon="tim-icons icon-align-center"
        />  -->
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import EmployeeDetail from "../../pages/EmployeeDetail.vue";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    
    EmployeeDetail,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
