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
              <h5 class="card-title">Divisions</h5>
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

    <DivisionDetail :division="division" :showModal="showModal"></DivisionDetail>

    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>

    <loader :is-visible="isLoading"></loader>
  </div>
</template>

<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import { BaseAlert } from "../components";
import Modal from "../components/Modal.vue";
import Loader from "../components/Loader.vue";
import { APIFactory } from "../services/APIFactory";
import DivisionDetail from "./DivisionDetail.vue";
import ConfirmDialogue from "./ConfirmDialogue.vue";

const DivisionService = APIFactory.get('division');

export default {
  components: {
    Modal,
    BaseAlert,
    Loader,
    DivisionDetail,
    ConfirmDialogue
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
      DivisionService.get(`code=${this.code.value}`)
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
      DivisionService.get()
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
        DivisionService.getDivision(item.id)
          .then(response => {
            this.division = response.data.data
            this.dividionSelected = this.division.divisionId
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
        this.division = {}
        this.showModal = true
        this.isLoading = false;
      }
    },

    async confirmPopup(item) {
      this.division = item;
      const ok = await this.$refs.confirmDialogue.show({
        title: 'Delete Division',
        message: `Are you sure you want to delete ${this.division.name}? It cannot be undone.`,
        okButton: 'Delete',
      });
      if (ok) {
        this.delItem()
      }
    },

    delItem() {

      this.isLoading = true;
      DivisionService.delDivision(this.division.id)
        .then(response => {
          this.notifyVue('top', 'right', "Deleted division success!")
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
      code: {
        value: "",
        error: false
      },

      isLoading: false,
      showModal: false,
      showModalDel: false,
      division: {},

      tableData: [
      ],

      table: {
        title: "Table on Plain Background",
        columns: ["Code", "Name", "CreatedDate", "CreatedBy", "Action"],
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
  border: none;
  margin-top: 20px;
  color: #fff;
  font-size: 1.2rem;
}
</style>
