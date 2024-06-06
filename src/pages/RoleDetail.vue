<template>
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
                <div class="row">
                    <div class="col-6">
                        <label class="ml-1 mr-1 mt-1 mb-1">Role Action: </label>
                    </div>
                    <div class="col-12">
                        <template v-for="item in controllerActions">
                            <ul>
                                <li class="text-dark">
                                    <label class="checkbox">
                                        <input type="checkbox" :name="item.name" :value="item.id"
                                            v-model="controllerActionsSelected" :key="item.id" />
                                        {{ item.name }}
                                    </label>
                                </li>
                            </ul>
                        </template>
                    </div>

                </div>
            </form>
        </div>
        <div class="modal-footer">
            <div class="mt-2 mx-auto">
                <button type="submit" class="btn btn-success ml-1 mr-1 mt-1 mb-1" @click="saveRole">Save</button>
                <button class="btn btn-secondary ml-1 mr-1 mt-1 mb-1" @click="closeModal">Close</button>
            </div>
        </div>
    </modal>
</template>
<script>
import Modal from "../components/Modal.vue";
import { APIFactory } from "../services/APIFactory";

const RoleService = APIFactory.get('role');

export default {
    props: { role: {}, controllerActions: [], showModal: false, controllerActionsSelected: [] },
    components: {
        Modal,
    },
    created() {
    },
    mounted() {
    },
    watch: {
        controllerActions: {
            // We have to move our method to a handler field
            handler() {
            }
        },
        controllerActionsSelected: {
            // We have to move our method to a handler field
            handler() {
            }
        }

    },
    computed: {
        sortedArray: function () {
            function compare(a, b) {
                if (a.controller < b.controller)
                    return -1;
                if (a.controller > b.controller)
                    return 1;
                return 0;
            }

            return this.controllerActions.sort(compare);
        }
    },
    methods: {
        saveRole() {

            this.$parent.isLoading = true;
            this.role.controllerActions = this.controllerActionsSelected;
            if (this.role && this.role.id && this.role.id != 0) {
                RoleService.updateRole(this.role.id, this.role)
                    .then(response => {
                        this.$parent.notifyVue('top', 'right', "Updated Role success!")
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
                RoleService.saveRole(this.role)
                    .then(response => {
                        this.$parent.notifyVue('top', 'right', "Created Role success!")
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
            }
        },
        closeModal() {
            this.$parent.isLoading = false;
            this.$emit('onClose')
        }
    }
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