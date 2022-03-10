<template>
  <h2 class="text-center mt-5">前台購物車</h2>
  <VLoading :active="isLoading"></VLoading>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="text-end">
        <button
          class="btn btn-outline-danger"
          type="button"
          @click="deleteCartAll"
          :disabled="cartData.carts.length === 0"
        >
          清空購物車
        </button>
      </div>
      <table class="table align-middle mt-3">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th class="text-end">單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cartData.carts">
            <tr v-for="item in cartData.carts" :key="item.id">
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)"
                  :disabled="isLoadingItem === item.id"
                >
                  <div
                    class="spinner-border spinner-border-sm"
                    v-if="isLoadingItem === item.id"
                  ></div>
                  移除購物車
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    class="form-control"
                    min="1"
                    v-model.number="item.qty"
                    @blur="updateCartItem(item)"
                  />
                  <div class="input-group-text">/ {{ item.product.unit }}</div>
                </div>
              </td>
              <td class="text-end">
                <small
                  v-if="cartData.final_total !== cartData.total"
                  class="text-success"
                  >折扣價：</small
                >
                {{ $filters.currency(item.final_total) }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{ $filters.currency(cartData.total) }}</td>
          </tr>
          <tr v-if="cartData.final_total !== cartData.total">
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">
              {{ $filters.currency(cartData.final_total) }}
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="input-group mb-3 input-group-sm">
        <input
          type="text"
          class="form-control"
          v-model="coupon_code"
          placeholder="請輸入優惠碼"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="addCouponCode"
          >
            套用優惠碼
          </button>
        </div>
      </div>

      <div class="my-5 row justify-content-center">
        <h3 class="text-center mt-5">收件人資訊</h3>
        <VForm
          ref="form"
          class="col-md-6"
          v-slot="{ errors }"
          @submit="createOrder"
        >
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <VField
              id="email"
              name="email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></VField>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <VField
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名"
              rules="required"
              v-model="form.user.name"
            ></VField>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <VField
              id="tel"
              name="電話"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              :rules="isPhone"
              v-model="form.user.tel"
              required
            ></VField>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <VField
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></VField>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea
              name=""
              id="message"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-end">
            <button
              type="submit"
              class="btn btn-danger"
              :disabled="
                !cartData.carts.length || Object.keys(errors).length > 0
              "
              @submit.prevent="createOrder"
            >
              送出訂單
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["emitter"],
  data() {
    return {
      isLoading: false,
      cartData: {
        carts: [],
      },
      product: {},
      isLoadingItem: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      coupon_code: "",
    };
  },
  methods: {
    getCart() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.$http
        .get(api)
        .then((res) => {
          this.cartData = res.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.isLoading = true;
      this.$http
        .delete(api)
        .then((res) => {
          this.$httpMessageState(res, "移除購物車品項");
          this.isLoadingItem = "";
          this.isLoading = false;
          this.emitter.emit("cart-length");
          this.getCart();
        })
        .catch((err) => {
          this.$httpMessageState(err.response, "移除購物車品項");
        });
    },
    deleteCartAll() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/carts`;
      this.$http
        .delete(api)
        .then((res) => {
          this.$httpMessageState(res, "清除購物車");
          this.isLoading = false;
          this.emitter.emit("cart-length");
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "清除購物車");
        });
    },
    updateCartItem(item) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cartData = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      this.$http
        .put(api, { data: cartData })
        .then((res) => {
          this.$httpMessageState(res, "更新購物車");
          this.isLoadingItem = "";
          this.emitter.emit("cart-length");
          this.getCart();
        })
        .catch((err) => {
          this.isLoadingItem = "";
          this.$httpMessageState(err.response, "更新購物車");
        });
    },
    addCouponCode() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.isLoading = true;
      this.$http
        .post(api, { data: coupon })
        .then((res) => {
          this.$httpMessageState(res, "加入優惠券");
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "加入優惠券");
        });
    },
    createOrder() {
      this.isLoading = true;
      const order = this.form;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      this.$http
        .post(api, { data: order })
        .then((res) => {
          this.$httpMessageState(res, "建立訂單");
          this.$router.push(`/checkout/${res.data.orderId}`);
          this.$refs.form.resetForm();
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "建立訂單");
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "電話 須為正確的電話號碼";
    },
  },
  mounted() {
    this.getCart();
  },
};
</script>
