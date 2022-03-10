import { createApp } from "vue";

import "@popperjs/core";

import axios from "axios";
import VueAxios from "vue-axios";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import CKEditor from "@ckeditor/ckeditor5-vue";

import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import AllRules from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

import $httpMessageState from "@/methods/pushMessageState";

import App from "./App.vue";
import router from "./router";

import { date, currency } from "./methods/filters";

// 定義所有驗證規則
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
// 設定 vee-validate 全域規則
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 因為設定檔可能沒辦法直接啟用，所以強制設定預設語系是中文
setLocale("zh_TW");

const app = createApp(App);
app.config.globalProperties.$filters = {
  date,
  currency,
};

// 掛載在 Global，這裡可以使用 provide 來處理
app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(router);
app.use(VueAxios, axios);
app.use(CKEditor);
app.component("VLoading", Loading);
app.component("VForm", Form);
app.component("VField", Field);
app.component("ErrorMessage", ErrorMessage);
app.mount("#app");
