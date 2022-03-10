<template>
  <VLoading :active="isLoading" :z-index="1060"></VLoading>
  <div class="container">
    <h2 class="text-center mt-5">後台貼文列表</h2>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的頁面
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="200px">標題</th>
          <th width="200px">作者</th>
          <th>描述</th>
          <th width="100px">建立時間</th>
          <th width="100px">是否公開</th>
          <th width="120px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ $filters.date(article.create_at) }}</td>
          <td>
            <span v-if="article.isPublic">已上架</span>
            <span v-else>未上架</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="getArticle(article.id)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelArticleModal(article)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <AdminArticleModal
      ref="AdminArticleModal"
      :tempArticle="tempArticle"
      :is-new="isNew"
      @update-article="updateArticle"
    ></AdminArticleModal>
    <AdminDelModal
      :temp="tempArticle"
      ref="AdminDelModal"
      @del-item="delArticle"
    />
  </div>
</template>

<script>
import AdminArticleModal from "@/components/AdminArticleModal.vue";
import AdminDelModal from "@/components/DelModal.vue";

export default {
  data() {
    return {
      articles: [],
      isLoading: false,
      isNew: false,
      tempArticle: {
        content: "",
      },
      currentPage: 1,
    };
  },
  components: {
    AdminArticleModal,
    AdminDelModal,
  },
  methods: {
    getArticles(currentPage = 1) {
      this.currentPage = currentPage;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/articles?page=${currentPage}`;
      this.isLoading = true;
      this.$http
        .get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.articles = res.data.articles;
            this.pagination = res.data.pagination;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "連線錯誤");
        });
    },
    getArticle(id) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article/${id}`;
      this.$http
        .get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.openModal(false, res.data.article);
            this.isNew = false;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "連線錯誤");
        });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempArticle = {
          isPublic: false,
          create_at: new Date().getTime() / 1000,
          tag: [],
        };
        this.isNew = true;
      } else {
        this.tempArticle = { ...item };
        this.isNew = false;
      }
      this.$refs.AdminArticleModal.openModal();
    },
    updateArticle(item) {
      this.tempArticle = item;
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article`;
      let httpMethod = "post";
      let status = "新增貼文";
      this.isLoading = true;
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
        httpMethod = "put";
        status = "更新貼文";
      }
      this.$http[httpMethod](api, { data: this.tempArticle })
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, status);
          this.$refs.AdminArticleModal.hideModal();
          this.getArticles(this.currentPage);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
    openDelArticleModal(item) {
      this.tempArticle = { ...item };
      this.$refs.AdminDelModal.openModal();
    },
    delArticle() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
      this.isLoading = true;
      this.$http
        .delete(url)
        .then((res) => {
          this.isLoading = false;
          this.$httpMessageState(res, "刪除貼文");
          this.$refs.AdminDelModal.hideModal();
          this.getArticles(this.currentPage);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "刪除貼文");
        });
    },
  },
  created() {
    this.getArticles();
  },
};
</script>
