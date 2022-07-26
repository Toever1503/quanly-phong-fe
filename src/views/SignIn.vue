<template>
  <div class="grid justify-center align-middle pt-[100px] bg-[#fffcfc] h-full">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="padding: 50px; border: 1px #ede9e9 solid"
      class="max-w-[500px] max-h-[320px]"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" :loading="formLoading">Sign in</a-button>
        <a-button class="ml-2" type="link" href="/sign-up" >Sign up</a-button>
      </a-form-item>

      <div>
        <a-button style="margin: auto; display: block" type="link" href="/">Back home</a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import { AuthService } from "../services/AuthService";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      remember: true
    });
    const formLoading = ref(false);

    const onFinish = values => {
      formLoading.value = true;
      console.log("Success:", values);
      AuthService.signin(values).then(res => {
        formLoading.value = false;
        if (res.status === 200) {
          message.success("Login successfully!");
          console.log("res", res.data.data);
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("roles", res.data.data.authorities.reduce((s, s1) => s + "," + s1));

          if (res.data.data.authorities.find(e => e === "ROLE_ADMIN") !== undefined) {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }

        } else {
          formLoading.value = false;
          message.error("Login failed");
        }
      });
    };

    const onFinishFailed = errorInfo => {
      formLoading.value = false;
      console.log("Failed:", errorInfo);
    };

    return {
      formState,
      onFinish,
      onFinishFailed,
      formLoading
    };
  }

});
</script>