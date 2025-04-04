<template>
  <div class="register-container">
    <div class="register-content">
      <h2 class="register-title">Register</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" placeholder="Enter your name" />
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

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

        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your password" />
          <p v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</p>
        </div>

        <div class="input-group">
          <label for="role">Role</label>
          <select id="role" v-model="role" class="role-select">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="login-buttons">
          <button type="submit" class="login-btn">Register</button>
          <button type="button" class="signup-btn" @click="goToLogin">Go to Login</button>
        </div>

        <p v-if="errors.server" class="error server-error">{{ errors.server }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Form fields
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("user");

// Error handling
const errors = ref<{ [key: string]: string }>({});

// Form submit handler
const register = async () => {
  errors.value = {};

  // Validation
  if (!name.value) errors.value.name = "Name is required";
  if (!email.value) errors.value.email = "Email is required";
  if (!password.value) errors.value.password = "Password is required";
  if (password.value.length < 8) errors.value.password = "Password must be at least 8 characters";
  if (password.value !== confirmPassword.value) errors.value.confirmPassword = "Passwords does not match";

  if (Object.keys(errors.value).length > 0) return;

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      role: role.value,
    });
    router.push({ name: 'Login' }); // Redirect after success
  } catch (error: any) {
    errors.value.server = error.response?.data?.message || "Registration failed";
  }
};

const goToLogin = () => {
  router.push({ name: "Login" });
};
</script>
