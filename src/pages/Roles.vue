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
                      <button type="submit" class="btn btn-success action" @click="search()">SEARCH</button>
                    </div>
                    <div class="col-3">
                      <button type="button" class="btn btn-primary action" @click="editItem(null)">ADD</button>
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
                <pagination :totalPages="totalPages" :perPage="pageSize" :currentPage="currentPage" :total="totalCount"
                  @pagechanged="onPageChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RoleDetail :role="detail.role" :showModal="detail.showModal" :controllerActions="detail.controllerActions"
      :controllerActionsSelected="detail.controllerActionsSelected" @onClose="handleClose"></RoleDetail>

    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <loader :is-visible="isLoading"></loader>
  </div>
</template>
<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import { BaseAlert } from "../components";
import Modal from "../components/Modal.vue";
import { APIFactory } from "../services/APIFactory";
import Loader from "../components/Loader.vue";
import RoleDetail from "./RoleDetail.vue"
import ConfirmDialogue from "./ConfirmDialogue.vue";
import Pagination from "../components/Pagination.vue";
import { store } from '../store.js';

const RoleService = APIFactory.get('role');

const ControllerActionService = APIFactory.get('controllerAction');


export default {
  components: {
    Modal,
    BaseAlert, Loader,
    RoleDetail,
    ConfirmDialogue,
    Pagination
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
      RoleService.get(`code=${this.code.value}&PageNumber=${this.currentPage}`)
        .then(response => {
          this.tableData = response.data.data
          this.totalPages = response.data.totalPage
          this.pageSize = response.data.pageSize
          this.totalCount = response.data.totalCount
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
          this.totalPages = response.data.totalPage
          this.pageSize = response.data.pageSize
          this.totalCount = response.data.totalCount
          this.table.data = this.tableData

          this.getControllerActions()
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

    getControllerActions() {
      ControllerActionService.get('pageSize=-1')
        .then(response => {
          this.detail.controllerActions = response.data.data
          store.dispatch('addControllerAction', this.detail.controllerActions)
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

    onPageChange(page) {
      this.currentPage = page;
      this.search();
    },

    editItem(item) {
      this.isLoading = true;
      if (item) {
        RoleService.getRole(item.id)
          .then(response => {
            store.dispatch('addControllerAction', this.detail.controllerActions)
            this.detail.role = response.data.data
            this.detail.controllerActionsSelected = response.data.data.controllerActions
            this.dividionSelected = this.detail.role.roleId
            this.detail.showModal = true
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
        this.detail.role = {}
        this.detail.controllerActionsSelected = []
        this.detail.showModal = true
        this.isLoading = false;
      }
    },

    async confirmPopup(item) {
      this.detail.role = item;
      const ok = await this.$refs.confirmDialogue.show({
        title: 'Delete Role',
        message: `Are you sure you want to delete ${this.detail.role.name}? It cannot be undone.`,
        okButton: 'Delete',
      });
      if (ok) {
        this.delItem()
      }
    },

    delItem() {
      this.isLoading = true;
      RoleService.delRole(this.detail.role.id)
        .then(response => {
          this.notifyVue('top', 'right', "Deleted Role success!")
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
    handleClose() {
      this.detail.showModal = false
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

    camelCase(str) {
      // Using replace method with regEx
      if (str)
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '')
      return "";
    },
    hasValue(item, column) {
      return item[this.camelCase(column)];
    },
    itemValue(item, column) {
      return item[this.camelCase(column)];
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

      detail: {
        showModal: false,
        role: {},
        controllerActions: [],
        controllerActionsSelected: []
      },
      isLoading: false,

      tableData: [
      ],

      table: {
        title: "Table on Plain Background",
        columns: ["Code", "Name", "CreatedDate", "CreatedBy", "Action"],
        data: this.tableData,
      },
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      totalCount: 0
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
  border: none;
  margin-top: 20px;
  color: #fff;
  font-size: 1.2rem;
}
</style>
