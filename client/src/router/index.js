import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Register from '@/components/Register';
import Login from '@/components/Login';
import Summary from '../components/Summary';
import Match from '../components/Match';
import Table from '../components/Table';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Summary
    },
    {
      path: '/match/:id',
      name: 'match',
      component: Match
    },
    {
      path: '/table',
      name: 'table',
      component: Table
    }
  ],
  hashbang: false,
  mode: 'history'
});

export default router;
