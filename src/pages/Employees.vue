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
                      <input type="submit" value="Search" class="action" />
                    </div>
                    <div class="col-3">
                      <button type="submit" class="action">ADD</button>
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

                              <button class="btn btn-dangerous ml-1" @click="delItem(item)">Delete</button>
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
          <div class="col-12">
            <label class="ml-1 mr-1 mt-1 mb-1">Divisions: </label>
            <select class="ml-1 mr-1 mt-1 mb-1" v-model="dividionSelected">
              <option disabled value="">Please select one</option>
              <option v-for="division in divisions" :value="division.id">
                {{ division.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="mt-2 mx-auto">
          <button class="btn btn-success ml-1 mr-1 mt-1 mb-1">Save</button>
          <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1">Close</button>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import { BaseAlert } from "../components";
import Modal from "../components/Modal.vue";
import { APIFactory } from "../services/APIFactory";
const EmployeeService = APIFactory.get('employee');

const DivisionService = APIFactory.get('division');

export default {
  components: {
    Modal,
    BaseAlert
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
    initialize() {
      EmployeeService.get()
        .then(response => {
          this.tableData = response.data.data
          this.table.data = this.tableData
        })
        .catch(error =>
          // this.$toast.open(`${error.response.data.Message}`)
          alert(`${error.message}`)
        );
      DivisionService.get()
        .then(response => {
          this.divisions = response.data.data
          console.log(this.divisions)
        })
        .catch(error =>
          this.notifyVue('top', 'right', `${error.response.data.Message}`)
        );
    },

    editItem(item) {
      EmployeeService.getEmployee(item.id)
        .then(response => {
          this.employee = response.data.data
          console.log(this.employee)
          this.showModal = true
        })
        .catch(error =>
          this.notifyVue('top', 'right', `${error.response.data.Message}`)
        );
    },

    delItem(item) {
      console.log("del");
      console.log(item);
      // EmployeeService.get()
      //   .then(response => {
      //     this.tableData = response.data.data
      //     this.table.data = this.tableData
      //   })
      //   .catch(error =>
      //     // this.$toast.open(`${error.response.data.Message}`)
      //     alert(`${error.message}`)
      //   );
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

      username: {
        value: "",
        error: false
      },

      showModal: false,
      employee: {},
      dividionSelected: {},

      divisions: [],

      tableData: [
        {
          id: 1,
          name: "Dakota Rice",
          username: "$36.738",
          password: "Niger",
          createdate: "Oud-Turnhout",
          createby: "Oud-Turnhout",
        },
        {
          id: 2,
          name: "Minerva Hooper",
          username: "$23,789",
          password: "Curaçao",
          createdate: "Sinaai-Waas",
          createby: "Oud-Turnhout",
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          username: "$56,142",
          password: "Netherlands",
          createdate: "Baileux",
          createby: "Oud-Turnhout",
        },
        {
          id: 4,
          name: "Philip Chaney",
          username: "$38,735",
          password: "Korea, South",
          createdate: "Overland Park",
          createby: "Oud-Turnhout",
        },
        {
          id: 5,
          name: "Doris Greene",
          username: "$63,542",
          password: "Malawi",
          createdate: "Feldkirchen in Kärnten",
          createby: "Oud-Turnhout",
        },
        {
          id: 6,
          name: "Mason Porter",
          username: "$98,615",
          password: "Chile",
          createdate: "Gloucester",
          createby: "Oud-Turnhout",
        },
        {
          id: 7,
          name: "Jon Porter",
          username: "$78,615",
          password: "Portugal",
          createdate: "Gloucester",
          createby: "Oud-Turnhout",
        },
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
