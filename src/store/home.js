let home = {
    state: {
        isLoaded: false
    },
    mutations: {
        setLoaded(state){
            console.log('change')
            state.isLoaded = true;
        },
        resetLoaded(state){
            state.isLoaded = false;
        }
    }
}

export default home;