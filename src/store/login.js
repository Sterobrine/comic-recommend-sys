let login = {
    state: {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null
    },
    mutations: {
        getToken(state){
            return state.token;
        },
        setToken(state,token){
            localStorage.setItem('token',token);
            state.token = token;
        },
        clearToken(state){
            localStorage.removeItem('token');
            state.token = null;
        }
    }
}

export default login;