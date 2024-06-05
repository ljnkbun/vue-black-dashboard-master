
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    controllerActions: []
};

const mutations = {
    AddControllerAction(state, data) {
        state.controllerActions = data;
    }
};

const actions = {
    addControllerAction(context, data) {
        context.commit("AddControllerAction", data)
    }
};

const getters = {
    getControllerAction(state) {
        return state.controllerActions;
    }
};

export const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});


