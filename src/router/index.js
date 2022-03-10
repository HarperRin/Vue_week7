import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/FrontView.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/IndexView.vue"),
      },
      {
        path: "products",
        name: "產品列表",
        component: () => import("../views/ProductsView.vue"),
      },
      {
        path: "cart",
        name: "購物車",
        component: () => import("../views/CartView.vue"),
      },
      {
        path: "checkout/:orderId",
        component: () => import("../views/CheckoutView.vue"),
      },
      {
        path: "articles",
        component: () => import("../views/ArticlesView.vue"),
      },
      {
        path: "article/:articleId",
        component: () => import("../views/ArticleView.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/admin",
    component: () => import("../views/DashboardView.vue"),
    children: [
      {
        path: "products",
        component: () => import("../views/AdminProducts.vue"),
      },
      {
        path: "orders",
        component: () => import("../views/AdminOrders.vue"),
      },
      {
        path: "coupons",
        component: () => import("../views/AdminCoupons.vue"),
      },
      {
        path: "article",
        component: () => import("../views/AdminArticle.vue"),
      },
    ],
  },
  {
    path: "/admin/:pathMatch(.*)*",
    redirect: { name: "Login" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active", // Bootstrap
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition);
    if (to.fullPath.match("FrontView")) {
      return {
        top: 0,
      };
    }
    return {};
  },
});

export default router;
