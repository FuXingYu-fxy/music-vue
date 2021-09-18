import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../views/Home');
const First = () => import('../views/First');
const About = () => import(/* webpackChunkName: "about" */ '../views/About.vue');
const My = () => import('../views/My');
const More = () => import('../views/More');
const Login = () => import('../views/Login');
const PlayListContainer = () => import('../views/PlayListContainer');

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'first',
    component: First,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/playList/:id',
    name: 'PlayList',
    component: PlayListContainer,
    props: true,
    
  },
  {
    path: '/my',
    name: 'My',
    component: My,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/more',
    name: 'More',
    component: More,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
