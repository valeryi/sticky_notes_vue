import idb from '@/api/idb';

export default {
    namespaced: true,
    state: {
        editable: null,
    },
    getters: {
        getEditable(state, _) {
            return state.editable;
        }
    },
    actions: {
        delete({ commit, getters }, id) {
            const editable = getters.getEditable;
            const todos = editable.list.filter(todo => todo.id !== id);

            const updated = {
                ...editable,
                list: todos
            }

            commit('setEditable', updated);
        },
        add({ commit, getters }, title) {
            const editable = getters.getEditable;
            const id = Math.floor(Math.random() * Date.now());
            const createdTask = { title, id, done: false };
            const todos = [...editable.list, createdTask];
            const updated = { ...editable, list: todos };

            commit('setEditable', updated);
        },
        update({ commit, getters }, updatedTodo) {
            const editable = getters.getEditable;
            const updatedTodos = editable.list.map(todo => {

                if (todo.id === updatedTodo.id) {
                    return todo = updatedTodo;
                }
                return todo;
            });
            const updated = { ...editable, list: updatedTodos };

            commit("setEditable", updated);
        },
        async initEdit({ commit, dispatch }, initial) {
            const idbHistory = await idb.get('history');
            const hl = idbHistory.length;

            if (!hl) {
                commit("todos/setEditable", initial, { root: true });
                await idb.update({ cursor: 0, id: 1 }, 'cursor');
            } else {
                const lastUpdate = idbHistory.pop().snapshot;

                dispatch("history/update", lastUpdate, { root: true });
                commit("todos/setEditable", lastUpdate, { root: true });
            }
        }
    },
    mutations: {
        setEditable(state, editable) {
            state.editable = editable;
        }
    }
}