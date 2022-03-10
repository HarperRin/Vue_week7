<template>
  <VLoading :active="isLoading" :z-index="1060"></VLoading>
  <div class="container">
    <h2 class="text-center mt-5">後台訂單列表</h2>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="120">應付金額</th>
          <th width="120">是否付款</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, key) in orders" :key="key">
          <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
            <td>{{ $filters.date(item.create_at) }}</td>
            <td><span v-text="item.user.email" v-if="item.user"></span></td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, i) in item.products" :key="i">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-start">{{ item.total }}</td>
            <td>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`paidSwitch${item.id}`"
                  v-model="item.is_paid"
                  @change="updatePaid(item)"
                />
                <label class="form-check-label" :for="`paidSwitch${item.id}`">
                  <span v-if="item.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
            </td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm"
                  type="button"
                  @click="openModal('edit', item)"
                >
                  檢視
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  @click="openModal('delete', item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <AdminOrderModal
      :tempOrder="tempOrder"
      :page="pagination"
      ref="AdminOrderModal"
      @update-paid="updatePaid"
    />
    <AdminDelModal
      :temp="tempOrder"
      :page="pagination"
      @del-item="delOrder"
      ref="AdminDelModal"
    />
    <Pagination :pages="pagination" @emit-pages="getOrders" />
  </div>
</template>

<script>
import Pagination from "@/components/PaginationView.vue";
import AdminDelModal from "@/components/DelModal.vue";
import AdminOrderModal from "@/components/AdminOrderModal.vue";

export default {
  data() {
    return {
      orders: {},
      tempOrder: {},
      isNew: false,
      pagination: {},
      isLoading: false,
      modal: {
        editModal: "",
        delModal: "",
      },
      currentPage: 1,
    };
  },
  components: {
    Pagination,
    AdminDelModal,
    AdminOrderModal,
  },
  methods: {
    getOrders(currentPage = 1) {
      this.currentPage = currentPage;
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${currentPage}`;
      this.$http
        .get(api, this.tempOrder)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    openModal(status, item) {
      if (status === "edit") {
        // 賦予資料
        this.tempOrder = JSON.parse(JSON.stringify(item));
        // 看資料是不是新增狀態，因為現在是編輯，所以是false狀態
        this.isNew = false;
        // 把Modal打開，做編輯
        this.$refs.AdminOrderModal.openModal();
      } else if (status === "delete") {
        // 賦予資料，因為刪除時要拿到產品名稱
        this.tempOrder = { ...item };
        // 不需要是因為this.isNew = false;是用來判斷新增/編輯的Modal，delete的Modal是獨立的
        this.$refs.AdminDelModal.openModal();
      }
    },
    updatePaid(item) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.$http
        .put(api, { data: paid })
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, "更新付款狀態");
          this.$refs.AdminOrderModal.hideModal();
          this.getOrders(this.currentPage);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    delOrder() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      this.$http
        .delete(api)
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, "刪除訂單");
          this.$refs.AdminDelModal.hideModal();
          this.getOrders(this.currentPage);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
