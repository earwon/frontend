<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit">Login</button>
      <p v-if="errors.server" class="error server-error">{{ errors.server }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref<{ [key: string]: string }>({});

const login = async () => {
  errors.value = {};

  // Validation
  if (!email.value) errors.value.email = "Email is required";
  if (!password.value) errors.value.password = "Password is required";

  if (Object.keys(errors.value).length > 0) return;

  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push("/albums"); // Redirect on success
  } catch (error: any) {
    errors.value.server = error.response?.data?.message || "Login failed";
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
  }

  .input-group {
    margin-bottom: 15px;
    text-align: left;

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
    }

    .error {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }
  }

  button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #0056b3;
    }
  }

  .server-error {
    margin-top: 10px;
    font-weight: bold;
  }
}
</style>
