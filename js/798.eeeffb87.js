"use strict";(self["webpackChunkvue_week7"]=self["webpackChunkvue_week7"]||[]).push([[798],{5798:function(s,e,t){t.r(e),t.d(e,{default:function(){return v}});var n=t(6252),a=t(9963);const o={class:"container mt-5"},i={class:"col-md-6"},r=(0,n._)("h1",{class:"h3 mb-3 font-weight-normal"},"請先登入",-1),u={class:"mb-2"},d=(0,n._)("label",{for:"inputEmail",class:"sr-only"},"Email address",-1),l={class:"mb-2"},c=(0,n._)("label",{for:"inputPassword",class:"sr-only"},"Password",-1),p=(0,n._)("div",{class:"text-end mt-4"},[(0,n._)("button",{class:"btn btn-lg btn-primary btn-block",type:"submit"}," 登入 ")],-1);function m(s,e,t,m,h,w){const g=(0,n.up)("VLoading"),b=(0,n.up)("ToastMessages");return(0,n.wg)(),(0,n.iD)("div",o,[(0,n.Wm)(g,{active:h.isLoading,"z-index":1060},null,8,["active"]),(0,n.Wm)(b),(0,n._)("form",{class:"row justify-content-center",onSubmit:e[2]||(e[2]=(0,a.iM)(((...s)=>w.signIn&&w.signIn(...s)),["prevent"]))},[(0,n._)("div",i,[r,(0,n._)("div",u,[d,(0,n.wy)((0,n._)("input",{type:"email",id:"inputEmail",class:"form-control",placeholder:"Email address","onUpdate:modelValue":e[0]||(e[0]=s=>h.user.username=s),required:"",autofocus:""},null,512),[[a.nr,h.user.username]])]),(0,n._)("div",l,[c,(0,n.wy)((0,n._)("input",{type:"password",id:"inputPassword",class:"form-control","onUpdate:modelValue":e[1]||(e[1]=s=>h.user.password=s),placeholder:"Password",required:""},null,512),[[a.nr,h.user.password]])]),p])],32)])}var h=t(2289),w={components:{ToastMessages:h.Z},data(){return{isLoading:!1,user:{username:"",password:""}}},methods:{signIn(){const s="https://vue3-course-api.hexschool.io/v2/admin/signin";this.isLoading=!0,this.$http.post(s,this.user).then((s=>{const{token:e,expired:t}=s.data;document.cookie=`hexToken=${e};expires=${new Date(t)};`,this.isLoading=!1,this.$router.push("/admin/products")})).catch((s=>{this.isLoading=!1,this.$httpMessageState(s.response,"登入"),this.user.password=""}))}}},g=t(3744);const b=(0,g.Z)(w,[["render",m]]);var v=b}}]);
//# sourceMappingURL=798.eeeffb87.js.map