import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/site/HomeView.vue";
import ManageRoom from "../views/admin/ManageRoomView.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        // {
        //   path: "category/:id/:name",
        //   component: Category,
        //   name: "Category"
        // } ,
        // {
        //   path: "product/:id/:name",
        //   component: ProductDetail,
        //   name: "product"
        // },
        // {
        //   path: "slick",
        //   component: slick,
        //   name: "slicker"
        // },
        // {
        //   path: "my-cart",
        //   component: Cart,
        //   name: "Giỏ hàng"
        // }
        // {
        //   path: '/shop',
        //   component: Shop,
        //   name: 'Shop'
        // },
        // {
        //   path: '/product',
        //   component: Product,
        //   name: 'Product'
        // },
        // {
        //   path: '/blog',
        //   component: Blog,
        //   name: 'Blog'
        // },
        // {
        //   path: '/post',
        //   component: Post,
        //   name: 'Post'
        // },
        // {
        //   path: '/cart',
        //   component: Cart,
        //   name: 'Cart'
        // }
      ]

    },
    {
      path: "/admin",
      component: ManageRoom,
      name: "manage-room"
    },
    {
      path: "/sign-up",
      component: SignUp,
      name: "Sign up"
    },
    {
      path: "/sign-in",
      component: SignIn,
      name: "Sign in"
    },


  ]
});

export default router;
