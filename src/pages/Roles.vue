<template>
  <div class="row ">
    <div class="col-12">
      <div class="row">
        <div class="col-12">
          <card class="card">
            <div class="card-header">
              <form>
                <div class="form col-12">
                  <div class="row">
                    <div class="col-2">
                      <input aria-label="Code" type="text" class="mr-2" ref="code" placeholder="code" autofocus
                        v-model="code.value" />
                    </div>
                    <div class="col-3">
                      <input type="submit" value="Search" class="action" @click="search()" />
                    </div>
                    <div class="col-3">
                      <button type="button" class="action" @click="editItem(null)">ADD</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Roles</h5>
              <div class="table-full-width table-responsive">
                <table class="table tablesorter table-hover">
                  <thead>
                    <tr>
                      <th v-for="columnItem in table.columns" :key="columnItem">{{ columnItem }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in table.data" :key="index">
                      <slot :row="item">
                        <template v-for="(column, index) in table.columns">
                          <td :key="index" v-if="hasValue(item, column)">
                            {{ itemValue(item, column) }}
                          </td>
                          <td v-else-if="isActionCol(column)">
                            <div class="row">
                              <button class="btn btn-primary mr-1" @click="editItem(item)">Edit</button>

                              <button class="btn btn-dangerous ml-1" @click="confirmPopup(item)">Delete</button>
                            </div>

                          </td>
                          <td v-else>

                          </td>

                        </template>
                      </slot>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal :show.sync="showModal" class="modal-search" id="searchModal" :centered="false" :show-close="true">
      <div class="modal-header">
        <h1 class="text-dark">Role Detail</h1>
      </div>
      <div class="modal-body">
        <form>
          <div class="row">
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Code: </label>
              <input type="text" class="ml-1 mr-1 mt-1 mb-1" v-model="role.code" />
              <input type="hidden" class="ml-1 mr-1 mt-1 mb-1" v-model="role.id" />
            </div>
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Name: </label>
              <input class="ml-1 mr-1 mt-1 mb-1" type="text" v-model="role.name" />
            </div>

          </div>
        </form>
      </div>
      <div class="modal-footer">
        <div class="mt-2 mx-auto">
          <button type="submit" class="btn btn-success ml-1 mr-1 mt-1 mb-1" @click="saveRole">Save</button>
          <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="showModal = false">Close</button>
        </div>
      </div>
    </modal>
    <modal :show.sync="showModalDel" class="modal-search" id="delConfirmed" :centered="false" :show-close="true">
      <div class="modal-header">
        <h1 class="text-dark">Delete Role</h1>
      </div>
      <div class="modal-body">
        <form>
          <h2 class="text-dark ">Do you sure to delete Role {{ role.name }}???</h2>
          <input type="hidden" class="ml-1 mr-1 mt-1 mb-1" v-model="role.id" />
        </form>
      </div>
      <div class="modal-footer">
        <div class="mt-2 mx-auto">
          <button type="submit" class="btn btn-danger ml-1 mr-1 mt-1 mb-1" @click="delItem">Confirmed</button>
          <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="showModalDel = false">Close</button>
        </div>
      </div>
    </modal>

    <loader :is-visible="isLoading"></loader>
  </div>
</template>
<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import { BaseAlert } from "../components";
import Modal from "../components/Modal.vue";
import { APIFactory } from "../services/APIFactory";
import Loader from "../components/Loader.vue";

const RoleService = APIFactory.get('role');

export default {
  components: {
    Modal,
    BaseAlert, Loader

  },
  created() {
    // 1. Before the DOM has been set up
    // this.initialize();
  },
  mounted() {
    // 2. The DOM is ready to go now
    this.initialize();
  },
  methods: {
    search() {

      this.isLoading = true;
      RoleService.get(`code=${this.code.value}`)
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData

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
    initialize() {
      this.isLoading = true;
      RoleService.get()
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData

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

    editItem(item) {

      this.isLoading = true;
      if (item) {
        RoleService.getRole(item.id)
          .then(response => {
            this.role = response.data.data
            this.dividionSelected = this.role.roleId
            this.showModal = true
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
      } else {
        this.role = {}
        this.showModal = true
        this.isLoading = false;
      }
    },

    saveRole() {

      this.isLoading = true;
      if (this.role && this.role.id && this.role.id != 0) {
        RoleService.updateRole(this.role.id, this.role)
          .then(response => {
            this.notifyVue('top', 'right', "Updated Role success!")
            this.showModal = false;
            this.initialize();
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
      } else {
        RoleService.saveRole(this.role)
          .then(response => {
            this.notifyVue('top', 'right', "Created Role success!")
            this.showModal = false;
            this.initialize();
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
      }
    },

    confirmPopup(item) {
      this.role = item;
      this.showModalDel = true
    },

    delItem() {

      this.isLoading = true;
      RoleService.delRole(this.role.id)
        .then(response => {
          this.notifyVue('top', 'right', "Deleted Role success!")
          this.showModalDel = false;
          this.initialize();
        })
        .catch(error => {
          if (error.response) {
            this.notifyVue('top', 'right', `${error.response.data.message}`)
            if (error.response.data.message == 'Unauthorized') {
              this.$router.push({ name: 'login', query: { redirect: '/login' } })
            }
          }
          this.isLoading = false;
        }
        );
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
    hasValue(item, column) {
      return item[column.toString().toLowerCase()];
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    isActionCol(column) {
      return column == "Action";
    },
  },
  data() {
    return {
      type: ["", "info", "success", "warning", "danger"],
      code: {
        value: "",
        error: false
      },

      isLoading: false,
      showModal: false,
      showModalDel: false,
      role: {},

      tableData: [
      ],

      table: {
        title: "Table on Plain Background",
        columns: ["Code", "Name", "CreateDate", "CreateBy", "Action"],
        data: this.tableData,
      },
    };
  },
};
</script>
<style lang="scss">
@mixin box {
  box-shadow: 1px 1px 2px 1px #ccc;
}

@mixin field {
  border: 1px solid #aaa;
  height: 40px;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  box-sizing: border-box;
}

input[type="text"] {
  @include field;
}


.action {
  height: 40px;
  text-transform: uppercase;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  background: green;
  margin-top: 20px;
  color: #fff;
  font-size: 1.2rem;
  @include box;
}
</style>
