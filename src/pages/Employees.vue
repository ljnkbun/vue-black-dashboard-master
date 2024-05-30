<template>
  <div class="row ">
    <div class="col-12">
      <div class="row">
        <div class="col-12">
          <card class="card">
            <div class="card-header">
              <form>
                <div class="form">
                  <input aria-label="Username" type="text" class="mr-2" ref="username" placeholder="Username" autofocus
                    v-model="username.value" />
                  <input type="submit" value="Search" class="action" />

                  <button type="submit" class="action">ADD</button>
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
                <base-table :title="table.title" :sub-title="table.subTitle" :data="table.data"
                  :columns="table.columns">
                </base-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BaseTable } from "@/components";
const tableColumns = ["Name", "Username", "Password", "CreateDate", "CreateBy", "Action"];
const tableData = [
  {
    id: 1,
    name: "Dakota Rice",
    username: "$36.738",
    password: "Niger",
    createDate: "Oud-Turnhout",
    createBy: "Oud-Turnhout",
  },
  {
    id: 2,
    name: "Minerva Hooper",
    username: "$23,789",
    password: "Curaçao",
    createDate: "Sinaai-Waas",
    createBy: "Oud-Turnhout",
  },
  {
    id: 3,
    name: "Sage Rodriguez",
    username: "$56,142",
    password: "Netherlands",
    createDate: "Baileux",
    createBy: "Oud-Turnhout",
  },
  {
    id: 4,
    name: "Philip Chaney",
    username: "$38,735",
    password: "Korea, South",
    createDate: "Overland Park",
    createBy: "Oud-Turnhout",
  },
  {
    id: 5,
    name: "Doris Greene",
    username: "$63,542",
    password: "Malawi",
    createDate: "Feldkirchen in Kärnten",
    createBy: "Oud-Turnhout",
  },
  {
    id: 6,
    name: "Mason Porter",
    username: "$98,615",
    password: "Chile",
    createDate: "Gloucester",
    createBy: "Oud-Turnhout",
  },
  {
    id: 7,
    name: "Jon Porter",
    username: "$78,615",
    password: "Portugal",
    createDate: "Gloucester",
    createBy: "Oud-Turnhout",
  },
];

export default {
  components: {
    BaseTable,
  },
  data() {
    return {
      username: {
        value: "",
        error: false
      },

      table: {
        title: "Table on Plain Background",
        columns: [...tableColumns],
        data: [...tableData],
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
