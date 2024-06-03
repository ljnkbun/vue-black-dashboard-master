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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal :show.sync="showModal" class="modal-search" id="searchModal" :centered="false" :show-close="true">
      <div class="modal-header">
        <h1 class="text-dark">Employee Detail</h1>
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
          <div class="row">
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Divisions: </label>
              <select class="ml-1 mr-1 mt-1 mb-1" v-model="dividionSelected">
                <option disabled value="">Please select one</option>
                <option v-for="division in divisions" :value="division.id">
                  {{ division.name }}
                </option>
              </select>
            </div>
            <div class="col-6">
              <label class="ml-1 mr-1 mt-1 mb-1">Role: </label>
              <!-- <select class="ml-1 mr-1 mt-1 mb-1" v-model="rolesSelected" multiple>
                <option disabled value="">Please select</option>
                <option v-for="role in roles" :value="role.id">
                  {{ role.name }}
                </option>
              </select> -->
              <multiselect v-model="rolesSelected" :options="roles" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="true" placeholder="Pick some" label="name" track-by="name"
                :preselect-first="true">
                <template #selection="{ values, search, isOpen }">
                  <span class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length }} options
                    selected</span>
                </template>
              </multiselect>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <div class="mt-2 mx-auto">
          <button type="submit" class="btn btn-success ml-1 mr-1 mt-1 mb-1" @click="saveEmployee">Save</button>
          <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="showModal = false">Close</button>
        </div>
      </div>
    </modal>

    <modal :show.sync="showModalDel" class="modal-search" id="delConfirmed" :centered="false" :show-close="true">
      <div class="modal-header">
        <h1 class="text-dark">Delete Employee</h1>
      </div>
      <div class="modal-body">
        <form>
          <h2 class="text-dark ">Do you sure to delete employee {{ employee.name }}???</h2>
          <input type="hidden" class="ml-1 mr-1 mt-1 mb-1" v-model="employee.id" />
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
import Multiselect from 'vue-multiselect';
import { APIFactory } from "../services/APIFactory";
import Loader from "../components/Loader.vue";
const EmployeeService = APIFactory.get('employee');

const DivisionService = APIFactory.get('division');

const RoleService = APIFactory.get('role');

export default {
  components: {
    Modal,
    BaseAlert,
    Multiselect,
    Loader
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
      EmployeeService.get(`username=${this.username.value}`)
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
      EmployeeService.get()
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData
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

    saveEmployee() {

      this.isLoading = true;
      var roleIdSelected = this.rolesSelected.map(x => x.id);
      if (this.employee && this.employee.id && this.employee.id != 0) {
        this.employee.divisionId = this.dividionSelected
        this.employee.roleIds = roleIdSelected
        EmployeeService.updateEmployee(this.employee.id, this.employee)
          .then(response => {
            this.notifyVue('top', 'right', "Updated Employee success!")
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
        this.employee.divisionId = this.dividionSelected
        this.employee.roleIds = roleIdSelected
        EmployeeService.saveEmployee(this.employee)
          .then(response => {
            this.notifyVue('top', 'right', "Created Employee success!")
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
      this.employee = item;
      this.showModalDel = true
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
        columns: ["Name", "Username", "Password", "CreateDate", "CreateBy", "Action"],
        data: this.tableData,
      },
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
