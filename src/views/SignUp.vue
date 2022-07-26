<template>
  <div class="grid justify-center align-middle pt-[100px] bg-[#fffcfc] h-full">
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="padding: 50px; border: 1px #ede9e9 solid"
      class="max-w-[500px] max-h-[380px]"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item
        label="Fullname"
        name="fullName"
        :rules="[{ required: true, message: 'Please input your name!' }]"
      >
        <a-input v-model:value="formState.fullName" />
      </a-form-item>
      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Please input your email!' }]"
      >
        <a-input type="email" v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" :loading="formLoading">Sign up</a-button>
        <a-button class="ml-2" type="link" href="/sign-in">Sign in</a-button>
      </a-form-item>
      <div>
        <a-button style="margin: auto; display: block" type="link" href="/">Back home</a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { AuthService } from "../services/AuthService";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const formState = ref({
      username: "",
      password: "",
      fullName: "",
      email: ""
    });
    const formLoading = ref(false);

    const onFinish = values => {
      formLoading.value = true;
      console.log("Success:", values);
      AuthService.signUp(values).then(res => {
        formLoading.value = false;
        console.log("res: ", res);

        message.success("Sign up successfully. You can sign in now!");
        formState.value = {
          username: "",
          password: "",
          fullName: "",
          email: ""
        };
      }).catch(err => {
        formLoading.value = false;
        console.log("err", err);
        message.error(err.response.data.message);
      });
    };

    const onFinishFailed = errorInfo => {
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