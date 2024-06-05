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
                      <input aria-label="Username" type="text" class="mr-2" ref="username" placeholder="Username"
                        autofocus v-model="username.value" />
                    </div>
                    <div class="col-3">
                      <input type="submit" value="Search" class="btn btn-success action" @click="search()" />
                    </div>
                    <div class="col-3">
                      <button type="button" class="btn btn-success action" @click="editItem(null)">ADD</button>
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
              <h5 class="card-title">Employees</h5>
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

    <EmployeeDetail :employee="employee" :divisions="divisions" :dividionSelected="dividionSelected"
      :rolesSelected="rolesSelected" :roles="roles" :showModal="showModal"></EmployeeDetail>

    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>

    <loader :is-visible="isLoading"></loader>
  </div>
</template>

<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import EmployeeDetail from "./EmployeeDetail.vue";
import { BaseAlert } from "../components";
import Modal from "../components/Modal.vue";
import Multiselect from 'vue-multiselect';
import { APIFactory } from "../services/APIFactory";
import Loader from "../components/Loader.vue";
import ConfirmDialogue from "./ConfirmDialogue.vue";
import Pagination from "../components/Pagination.vue";

const EmployeeService = APIFactory.get('employee');

const DivisionService = APIFactory.get('division');

const RoleService = APIFactory.get('role');

export default {
  components: {
    Modal,
    BaseAlert,
    Multiselect,
    Loader,
    EmployeeDetail,
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
      EmployeeService.get(`username=${this.username.value}&PageNumber=${this.currentPage}`)
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData
          this.totalPages = response.data.totalPage
          this.pageSize = response.data.pageSize
          this.totalCount = response.data.totalCount
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
      EmployeeService.get()
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData
          this.totalPages = response.data.totalPage
          this.pageSize = response.data.pageSize
          this.totalCount = response.data.totalCount
          this.getDivisions()
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
    getDivisions() {
      DivisionService.get()
        .then(response => {
          this.divisions = response.data.data
          this.getRoles()
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

    getRoles() {
      RoleService.get()
        .then(response => {
          this.roles = response.data.data
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
      console.log(page)
      this.currentPage = page;
      this.search();
    },

    editItem(item) {

      this.isLoading = true;
      if (item) {
        EmployeeService.getEmployee(item.id)
          .then(response => {
            this.employee = response.data.data
            this.dividionSelected = this.employee.divisionId

            var rolessSelected = this.roles.filter(x => this.employee.roleIds.includes(x.id));
            this.rolesSelected = rolessSelected
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
        this.employee = {}
        this.dividionSelected = {}
        this.rolesSelected = []
        this.showModal = true

        this.isLoading = false;
      }
    },

    async confirmPopup(item) {
      this.employee = item;
      const ok = await this.$refs.confirmDialogue.show({
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${this.employee.name}? It cannot be undone.`,
        okButton: 'Delete',
      });
      if (ok) {
        this.delItem()
      }
    },

    delItem() {
      this.isLoading = true;
      EmployeeService.delEmployee(this.employee.id)
        .then(response => {
          this.notifyVue('top', 'right', "Deleted Employee success!")
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
      username: {
        value: "",
        error: false
      },

      isLoading: false,
      showModal: false,
      showModalDel: false,
      employee: {},

      dividionSelected: {},
      divisions: [],

      rolesSelected: [],
      roles: [],

      tableData: [
      ],

      table: {
        title: "Table on Plain Background",
        columns: ["Name", "Username", "Password", "CreatedDate", "CreatedBy", "Action"],
        data: this.tableData,
      },
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      totalCount:0
    };
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
