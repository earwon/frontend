<script setup lang="ts">
import { useAlbumStore } from "@/stores/album";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";

const albumStore = useAlbumStore();
const authStore = useAuthStore();

onMounted(() => {
  albumStore.fetchAlbums();
});
</script>

<template>
  <div>
    <h2>Albums</h2>
    <input v-model="albumStore.searchQuery" placeholder="Search albums..." />
    <select v-model="albumStore.sortBy">
      <option value="votes">Sort by Votes</option>
      <option value="title">Sort Alphabetically</option>
    </select>

    <div v-for="album in albumStore.filteredAlbums" :key="album.id">
      <h3>{{ album.title }} - {{ album.artist }}</h3>
      <p>Release Date: {{ album.release_date }}</p>
      <p>Votes: {{ album.votes }}</p>
      <button @click="albumStore.vote(album.id, 'up')">👍 Upvote</button>
      <button @click="albumStore.vote(album.id, 'down')">👎 Downvote</button>
      <button v-if="authStore.isAdmin" @click="albumStore.deleteAlbum(album.id)">🗑 Delete</button>
    </div>
  </div>
</template>
