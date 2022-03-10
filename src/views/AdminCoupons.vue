<template>
  <VLoading :active="isLoading" :z-index="1060"></VLoading>
  <div class="container">
    <h2 class="text-center mt-5">後台優惠券列表</h2>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal('isNew')">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">名稱</th>
          <th width="120">折扣百分比</th>
          <th width="120">到期日</th>
          <th width="120">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <AdminCouponModal
      :tempCoupon="tempCoupon"
      :is-new="isNew"
      ref="AdminCouponModal"
      @update-coupon="updateCoupon"
    />
    <AdminDelModal
      :temp="tempCoupon"
      ref="AdminDelModal"
      @del-item="delCoupon"
    />
  </div>
</template>

<script>
import AdminCouponModal from "@/components/AdminCouponModal.vue";
import AdminDelModal from "@/components/DelModal.vue";

export default {
  props: {
    config: Object,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: "",
        is_enabled: 0,
        percent: 100,
        code: "",
      },
      isLoading: false,
      isNew: false,
    };
  },
  components: { AdminCouponModal, AdminDelModal },
  methods: {
    getCoupons() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons`;
      this.$http
        .get(api)
        .then((res) => {
          this.coupons = res.data.coupons;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    openModal(status, item) {
      if (status === "isNew") {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
        };
        // 看資料是不是新增狀態
        this.isNew = true; // 改變 status 的狀態
        this.$refs.AdminCouponModal.openModal();
      } else if (status === "edit") {
        // 賦予資料
        this.tempCoupon = JSON.parse(JSON.stringify(item)); //使用深拷貝，因為item.imageUrl裡還有陣列，進行修改會有傳參考的問題
        // 看資料是不是新增狀態，因為現在是編輯，所以是false狀態
        this.isNew = false;
        // 把Modal打開，做編輯
        this.$refs.AdminCouponModal.openModal();
      } else if (status === "delete") {
        // 賦予資料，因為刪除時要拿到產品名稱
        this.tempCoupon = { ...item };
        // 不需要是因為this.isNew = false;是用來判斷新增/編輯的Modal，delete的Modal是獨立的
        this.$refs.AdminDelModal.openModal();
      }
    },
    updateCoupon(item) {
      this.isLoading = true;
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let method = "post";
      let status = "新增優惠券";
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`;
        method = "put";
        status = "更新優惠券";
      }
      this.$http[method](api, { data: this.tempCoupon })
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, status);
          this.$refs.AdminCouponModal.hideModal();
          this.getCoupons();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, status);
        });
    },
    delCoupon() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http
        .delete(api)
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, "刪除優惠券");
          this.$refs.AdminDelModal.hideModal();
          this.getCoupons();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "刪除優惠券");
        });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
