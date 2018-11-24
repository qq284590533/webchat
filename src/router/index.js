import Vue from 'vue'
import Router from 'vue-router'
const login = r => require.ensure([], () => r(require('@/components/Login')), 'login')
const index = r => require.ensure([], () => r(require('@/components/Index')), 'index')

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/login',
			name: 'login',
			component: login
	  },
	  {
			path: '/index',
			name: 'index',
			component: index,
	  }
	]
})
