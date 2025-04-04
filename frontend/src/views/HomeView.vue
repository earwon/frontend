<template>
  <div class="home-container">
    <div class="home-content">
      <h1 class="home-title">Welcome to Music Albums Hub!</h1>
      <p class="home-description">
        Discover and vote for your favorite music albums. Join our community to explore, upvote, and discuss amazing music collections.
      </p>
      <div class="home-buttons">
        <button class="login-btn" @click="goToLogin">Login</button>
        <button class="signup-btn" @click="goToRegister">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push({ name: "Login" });
};

const goToRegister = () => {
  router.push({ name: 'Register' });
};
</script>