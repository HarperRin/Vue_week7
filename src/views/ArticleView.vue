<template>
  <VLoading :active="isLoading" :z-index="1060"></VLoading>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/articles">部落格列表</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ article.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ article.title }}</h2>
        <p>
          <small class="text-muted">{{
            $filters.date(article.create_at)
          }}</small>
          -
          <small class="text-muted">作者：{{ article.author }}</small>
        </p>
        <img :src="article.imageUrl" alt="" class="img-fluid mb-3" />
        <div v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      articleId: "",
    };
  },
  methods: {
    getArticle() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/article/${this.articleId}`;
      this.$http
        .get(api)
        .then((res) => {
          this.article = res.data.article;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, "錯誤訊息");
        });
    },
  },
  created() {
    this.articleId = this.$route.params.articleId;
    this.getArticle();
  },
};
</script>
