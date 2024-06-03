<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
    :class="{ 'bg-white': showMenu, 'navbar-transparent': !showMenu }">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{ toggled: $sidebar.showSidebar }">
          <button type="button" class="navbar-toggler" aria-label="Navbar toggle button" @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <a class="navbar-brand" href="#pablo">{{ routeName }}</a>
      </div>
      <button class="navbar-toggler" type="button" @click="toggleMenu" data-toggle="collapse" data-target="#navigation"
        aria-controls="navigation-index" aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
            <div class="search-bar input-group" @click="searchModalVisible = true">
              <!-- <input type="text" class="form-control" placeholder="Search...">
              <div class="input-group-addon"><i class="tim-icons icon-zoom-split"></i></div> -->
              <button class="btn btn-link" id="search-button" data-toggle="modal" data-target="#searchModal">
                <i class="tim-icons icon-zoom-split"></i>
              </button>
              <!-- You can choose types of search input -->
            </div>
            <modal :show.sync="searchModalVisible" class="modal-search" id="searchModal" :centered="false"
              :show-close="true">
              <input slot="header" v-model="searchQuery" type="text" class="form-control" id="inlineFormInputGroup"
                placeholder="SEARCH" />
            </modal>
            <base-dropdown tag="li" :menu-on-right="!$rtl.isRTL" title-tag="a" class="nav-item">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <div class="notification d-none d-lg-block d-xl-block"></div>
                <i class="tim-icons icon-sound-wave"></i>
                <p class="d-lg-none">New Notifications</p>
              </a>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Mike John responded to your email</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">You have 5 more tasks</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Your friend Michael is in town</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Another notification</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Another one</a>
              </li>
            </base-dropdown>
            <base-dropdown tag="li" :menu-on-right="!$rtl.isRTL" title-tag="a" class="nav-item"
              menu-classes="dropdown-navbar">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <div class="photo">
                  <img src="img/anime3.png" />
                </div>
                <b class="caret d-none d-lg-block d-xl-block"></b>
                <p class="d-lg-none">Log out</p>
              </a>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item" @click="editUser()">Profile</a>
              </li>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item">Settings</a>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a href="#" class="nav-item dropdown-item" type="submit" @click="logout">Log out</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
    <modal :show.sync="showUserModal" class="modal-search" id="userModal" :centered="false" :show-close="true">
      <div class="modal-header">
        <h1 class="text-dark">User Profile</h1>
      </div>
      <div class="modal-body">
        <form>
          <div class="row">
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Code: </label>
              <input type="text" class="ml-1 mr-1 mt-1 mb-1" v-model="employee.code" />
              <input type="hidden" class="ml-1 mr-1 mt-1 mb-1" v-model="employee.id" />
            </div>
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Name: </label>
              <input class="ml-1 mr-1 mt-1 mb-1" type="text" v-model="employee.name" />
            </div>

          </div>
          <div class="row">
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Username: </label>
              <input type="text" class="ml-1 mr-1 mt-1 mb-1" v-model="employee.username" />
            </div>
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Password: </label>
              <input class="ml-1 mr-1 mt-1 mb-1" type="text" v-model="employee.password" />
            </div>

          </div>
        </form>
      </div>
      <div class="modal-footer">
        <div class="mt-2 mx-auto">
          <button type="submit" class="btn btn-success ml-1 mr-1 mt-1 mb-1" @click="saveEmployee">Save</button>
          <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="showUserModal = false">Close</button>
        </div>
      </div>
    </modal>
    <loader :is-visible="isLoading"></loader>
  </nav>
</template>
<script>
import NotificationTemplate from "../../pages/Notifications/NotificationTemplate.vue";
import { CollapseTransition } from "vue2-transitions";
import Modal from "@/components/Modal";
import { APIFactory } from "../../services/APIFactory";
import Loader from "../../components/Loader.vue";
const AuthService = APIFactory.get('auth');

const EmployeeService = APIFactory.get('employee');

export default {
  components: {
    CollapseTransition,
    Modal,
    Loader
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  data() {
    return {
      type: ["", "info", "success", "warning", "danger"],
      activeNotifications: false,
      showMenu: false,

      searchModalVisible: false,
      searchQuery: "",

      isLoading: false,
      showUserModal: false,
      employee: {},
    };
  },
  methods: {
    editUser() {
      this.isLoading = true;
      var userId = localStorage.getItem("userId");
      EmployeeService.getEmployee(userId)
        .then(response => {
          this.employee = response.data.data
          this.showUserModal = true
          this.isLoading = false;
        })
        .catch(error => {
          if (error.response) {
            this.notifyVue('top', 'right', `${error.response.data.message}`)
            if (error.response.data.message == 'Unauthorized') {
              this.$router.push({ name: 'login', query: { redirect: '/login' } })
            }
          }
          this.isLoading = false;
        });

    },
    saveEmployee() {
      this.isLoading = true;
      EmployeeService.updateEmployee(this.employee.id, this.employee)
        .then(response => {
          this.notifyVue('top', 'right', "Updated Employee success!")
          this.showUserModal = false;
          this.isLoading = false;
        })
        .catch(error => {
          if (error.response) {
            this.notifyVue('top', 'right', `${error.response.data.message}`)
            if (error.response.data.message == 'Unauthorized') {
              this.$router.push({ name: 'login', query: { redirect: '/login' } })
            }
          }
          this.isLoading = false;
        });
    },

    notifyVue(verticalAlign, horizontalAlign, message) {
      const color = Math.floor(Math.random() * 4 + 1);
      this.$notify({
        component: NotificationTemplate,
        icon: "tim-icons icon-bell-55",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color],
        timeout: 1000,
        message: message
      });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    logout(event) {
      event.preventDefault();
      var userId = localStorage.getItem('userId');
      AuthService.logout(userId)
        .then(response => {
          if (response.data.data)
            this.$router.push({ name: 'login', query: { redirect: '/login' } });
          else
            alert("logout error");
        })
        .catch(error =>
          alert(error.response.data.message)
        );
    }
  },
};
</script>
<style></style>
