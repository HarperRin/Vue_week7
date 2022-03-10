<template>
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label"
                    >輸入主要圖片網址</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="newTemp.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="mb-3">
                  <label for="customFile" class="form-label"
                    >或 上傳圖片
                    <i
                      class="fas fa-spinner fa-spin"
                      v-if="status.fileUploading"
                    ></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="fileInput"
                    @change="uploadFile"
                  />
                </div>
                <img class="img-fluid" :src="temp.imageUrl" />
                <h3 class="mb-3">多圖新增</h3>
                <div v-if="Array.isArray(temp.imagesUrl)">
                  <template v-for="(img, key) in temp.imagesUrl" :key="key">
                    <div class="form-group mb-3">
                      <label for="imagesUrl" class="mb-2">圖片網址</label>
                      <input
                        v-model="newTemp.imagesUrl[key]"
                        type="url"
                        class="form-control"
                        id="imagesUrl"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img :src="img" alt="" class="img-fluid mb-3" />
                  </template>
                  <div
                    v-if="
                      !temp.imagesUrl.length ||
                      temp.imagesUrl[temp.imagesUrl.length - 1]
                    "
                  >
                    <button
                      class="btn btn-outline-primary btn-sm d-block w-100"
                      @click="newTemp.imagesUrl.push('')"
                    >
                      新增圖片
                    </button>
                  </div>
                  <div v-else>
                    <button
                      class="btn btn-outline-danger btn-sm d-block w-100"
                      @click="newTemp.imagesUrl.splice(key, 1)"
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div v-else>
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="createImg"
                  >
                    新增圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  v-model="newTemp.title"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    v-model="newTemp.category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    v-model="newTemp.unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    v-model.number="newTemp.origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    v-model.number="newTemp.price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  v-model="newTemp.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  v-model="newTemp.content"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    v-model="newTemp.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-product', newTemp)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from "@/mixins/modalMixin";

export default {
  props: ["temp", "is-new"],
  emits: ["update-product"],
  data() {
    return {
      modal: {},
      newTemp: {
        imagesUrl: [],
      },
      status: {},
    };
  },
  watch: {
    temp() {
      this.newTemp = this.temp;
    },
  },
  mounted() {
    this.newTemp = this.temp;
  },
  methods: {
    createImg() {
      this.newTemp.imagesUrl = [];
      this.newTemp.imagesUrl.push("");
    },
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`;
      this.status.fileUploading = true;
      this.$http
        .post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.status.fileUploading = false;
          if (res.data.success) {
            this.tempProduct.imageUrl = res.data.imageUrl;
            this.$refs.fileInput.value = "";
            this.emitter.emit("push-message", {
              style: "success",
              title: "圖片上傳結果",
              content: res.data.message,
            });
          } else {
            this.$refs.fileInput.value = "";
            this.emitter.emit("push-message", {
              style: "danger",
              title: "圖片上傳結果",
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.status.fileUploading = false;
          this.$httpMessageState(err.response, "圖片失敗");
        });
    },
  },
  mixins: [modalMixin],
  inject: ["emitter"],
};
</script>
