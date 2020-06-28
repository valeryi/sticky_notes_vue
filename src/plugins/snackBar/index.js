import SnackBarComponent from './SnackBarComponent.vue';

const SnackBarPlugin = {
    install(Vue) {
        Vue.component(SnackBarComponent.name, SnackBarComponent);
    },
};

export default SnackBarPlugin;