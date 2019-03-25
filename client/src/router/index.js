import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Register from '@/components/Register';
import Login from '@/components/Login';
import Match from '../components/Match';
import Competition from '../components/Competition';

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
      path: '/competition/:name/match/:id',
      name: 'Match',
      component: Match
    },
    {
      path: '/competition/:name',
      name: 'Competition',
      component: Competition
    }
  ],
  hashbang: false,
  mode: 'history'
});

export default router;
