import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/{{name}}/',
  routes: [
    {
      path: '/',
      name: 'home'
    },{
      path: '/user',
      name: 'user',
      component: r => require.ensure([], () => r(require('@contactstudio/admin-tools/src/components/CsUserConfigPage.vue'))),
      meta: {
        bcLinkText: 'Preferências'
      }
    }
  ]
})
