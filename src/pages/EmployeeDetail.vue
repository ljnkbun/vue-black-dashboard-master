<template>

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
                        <multiselect v-model="rolesSelected" :options="roles" :multiple="true" :close-on-select="false"
                            :clear-on-select="false" :preserve-search="true" placeholder="Pick some" label="name"
                            track-by="name" :preselect-first="true">
                            <template #selection="{ values, search, isOpen }">
                                <span class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length
                                    }} options
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
                <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="closeModal">Close</button>
            </div>
        </div>
    </modal>

</template>

<script>
import Modal from "../components/Modal.vue";
import Multiselect from 'vue-multiselect';
import { APIFactory } from "../services/APIFactory";
const EmployeeService = APIFactory.get('employee');

export default {
    props: { employee: {}, divisions: [], dividionSelected: {}, rolesSelected: {}, roles: [], showModal: false },
    components: {
        Modal,
        Multiselect,
    },
    watch: {
        employee: {
            // We have to move our method to a handler field
            handler() {
            }
        },
        roles: {
            // We have to move our method to a handler field
            handler() {
            }
        },
    },
    methods: {
        saveEmployee() {
            this.$parent.isLoading = true;
            var roleIdSelected = this.rolesSelected.map(x => x.id);
            if (this.employee && this.employee.id && this.employee.id != 0) {
                this.employee.divisionId = this.dividionSelected
                this.employee.roleIds = roleIdSelected
                EmployeeService.updateEmployee(this.employee.id, this.employee)
                    .then(response => {
                        this.$parent.notifyVue('top', 'right', "Updated Employee success!")
                        this.$parent.initialize();
                        this.closeModal();
                    })
                    .catch(error => {
                        if (error.response) {
                            this.$parent.notifyVue('top', 'right', `${error.response.data.message}`)
                            if (error.response.data.message == 'Unauthorized') {
                                this.$router.push({ name: 'login', query: { redirect: '/login' } })
                            }
                            if (error.response.data.message.includes('validation failures')) {
                                error.response.data.errors.forEach(element => {
                                    this.$parent.notifyVue('top', 'right', `${element.message}`)
                                });
                            }
                        }
                        this.closeModal();
                    });
            } else {
                this.employee.divisionId = this.dividionSelected
                this.employee.roleIds = roleIdSelected
                EmployeeService.saveEmployee(this.employee)
                    .then(response => {
                        this.$parent.notifyVue('top', 'right', "Created Employee success!")
                        this.closeModal();
                        this.$parent.initialize();
                    })
                    .catch(error => {
                        if (error.response) {
                            this.$parent.notifyVue('top', 'right', `${error.response.data.message}`)
                            if (error.response.data.message == 'Unauthorized') {
                                this.$router.push({ name: 'login', query: { redirect: '/login' } })
                            }
                            if (error.response.data.message.includes('validation failures')) {
                                error.response.data.errors.forEach(element => {
                                    this.$parent.notifyVue('top', 'right', `${element.message}`)
                                });
                            }
                        }
                        this.closeModal();
                    });
            }
        },

        closeModal() {
            this.$parent.isLoading = false;
            this.$emit('onClose')
        }
    }
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