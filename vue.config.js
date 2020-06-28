module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/scss/shared.scss";`
            }
        }
    }
}