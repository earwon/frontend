<template>
  <div class="login-container">
    <div class="login-content">
      <h2 class="login-title">Login</h2>
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

        <div class="login-buttons">
          <button type="submit" class="login-btn">Login</button>
          <button type="button" class="signup-btn" @click="goToRegister">Sign Up</button>
        </div>

        <p v-if="errors.server" class="error server-error">{{ errors.server }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted  } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref<{ [key: string]: string }>({});

// Autofill email and password if stored
onMounted(() => {
  email.value = sessionStorage.getItem("autofill_email") || "";
  password.value = sessionStorage.getItem("autofill_password") || "";

  // Clear autofill credentials after first use
  sessionStorage.removeItem("autofill_email");
  sessionStorage.removeItem("autofill_password");
});

const login = async () => {
  errors.value = {};

  // Validation
  if (!email.value) errors.value.email = "Email is required";
  if (!password.value) errors.value.password = "Password is required";

  if (Object.keys(errors.value).length > 0) return;

  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push({ name: 'Albums' }); // Redirect on success
  } catch (error: any) {
    errors.value.server = error.response?.data?.message || "Login failed";
  }
};

const goToRegister = () => {
  router.push({ name: "Register" });
};
</script>