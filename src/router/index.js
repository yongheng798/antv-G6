/*
 * @Descripttion: 陈品富写的demo描述
 * @version: 1.0
 * @Author: chenpinfu~陈品富
 * @Date: 2020-09-05 17:10:05
 * @LastEditors: chenpinfu~陈品富
 * @LastEditTime: 2020-09-13 09:50:37
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/treeCharts',
    name: 'TreeCharts',
    component: () => import('../views/antv/TreeCharts.vue')
  },
  {
    path: '/eventsChart',
    name: 'EventsChart',
    component: () => import('../views/antv/EventsChart.vue')
  },
  {
    path: '/ProcessHtml',
    name: 'ProcessHtml',
    component: () => import('../views/antv/ProcessHtml.vue')
  },
  {
    path: '/chartTs',
    name: 'chartTs',
    component: () => import('../views/antv/chartTs.vue')
  },
  {
    path: '/treeCollapsed',
    name: 'treeCollapsed',
    component: () => import('../views/antv/treeCollapsed.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
