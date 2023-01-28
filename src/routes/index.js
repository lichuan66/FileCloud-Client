import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/View/Login/LoginView.vue"),
  },
  {
    path: "/manage",
    component: () => import("@/View/MainView/MainView.vue"),
    children: [
      {
        path: "file",
        name: "file",
        meta: {
          isShow: true,
          title: "文件",
          label: "document",
        },
        component: () => import("@/components/FileManage/FileManage.vue"),
      },
      {
        path: "image",
        name: "image",
        meta: {
          isShow: true,
          title: "相册",
          label: "photo",
        },
        component: () => import("@/components/FileManage/FileManage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
