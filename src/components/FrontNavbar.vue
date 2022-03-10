<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">蛋糕坊</router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">購物車</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/articles">Blog</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products"
              >登入後台</router-link
            >
          </li>
        </ul>
      </div>
      <router-link class="btn btn-primary" to="/cart">
        查看購物車
        <span
          v-if="cartData.carts.length > 0"
          class="badge rounded-pill bg-danger"
          >{{ cartLength }}</span
        >
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  inject: ["emitter"],
  data() {
    return {
      cartData: {
        carts: [],
      },
      cartLength: 0,
    };
  },
  methods: {
    getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.$http
        .get(api)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    updateCartLength() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            let subTotal = 0;
            this.cartLength = res.data.data.carts.forEach((item) => {
              subTotal += item.qty;
            });
            this.cartLength = subTotal;
          }
        })
        .catch(() => {
          this.$httpMessageState("錯誤訊息");
        });
    },
  },
  mounted() {
    this.getCart();
    this.updateCartLength();
    this.emitter.on("cart-length", (qty) => {
      this.getCart();
      this.cartLength = qty;
      this.updateCartLength();
    });
  },
};
</script>
