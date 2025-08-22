import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ShareReceiver from '@/components/ShareReceiver.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/share',
      name: 'share',
      component: ShareReceiver
    }
  ]
});

export default router;
