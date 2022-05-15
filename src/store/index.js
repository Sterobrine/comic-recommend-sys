import Vue from 'vue';
import Vuex from 'vuex'
import menu from './menu.js'
import login from './login.js'
import home from './home.js'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        menu,
        login,
        home
    }
});

export default store;