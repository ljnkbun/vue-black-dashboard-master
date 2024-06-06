
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    controllerActions: [],
    token: String,
    userId: String,
};

const mutations = {
    addControllerAction(state, data) {
        state.controllerActions = data;
    },
    changeToken(state, token) {
        state.token = token;
    },
    changeUserId(state, userId) {
        state.userId = userId;
    },
    initialiseStore(state) {
        // Check if the ID exists
        if(localStorage.getItem('store')) {
            // Replace the state object with the stored item
            this.replaceState(
                Object.assign(state, JSON.parse(localStorage.getItem('store')))
            );
        }
    }
};

const actions = {
    addControllerAction(context, data) {
        context.commit("addControllerAction", data)
    },
    changeToken(context, data) {
        context.commit("changeToken", data)
    },
    changeUserId(context, data) {
        context.commit("changeUserId", data)
    }
};

const getters = {
    getControllerAction(state) {
        return state.controllerActions;
    },
    getToken(state) {
        return state.token;
    },
    getUserId(state) {
        return state.userId;
    }
};

export const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});
// Subscribe to store updates
store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});

