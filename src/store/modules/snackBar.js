export default {
    namespaced: true,
    state: {
        msg: '',
        callback: null,
        actionName: ''
    },
    getters: {
        state(state, _) {
            return { ...state }
        }
    },
    mutations: {
        setSnack(state, update) {
            state.msg = update.msg || '';
            state.callback = update.callback || null;
            state.actionName = update.actionName || 'Do!';
        }
    }
}