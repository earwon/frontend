<template>
  <div class="albums-container">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="dashboard-header__left">
        <p class="user-role">Role: {{ userRole }}</p>
      </div>
      <h1 class="dashboard-title">Albums</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>

    <!-- Search Bar -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search albums..."
      class="search-bar"
    />

    <!-- Albums List -->
    <div v-if="paginatedAlbums.length">
      <div v-for="album in paginatedAlbums" :key="album.id" class="album-card">
        <div class="album-info">
          <h3><strong>Title:</strong> {{ album.title }}</h3>
          <p><strong>Artist:</strong> {{ album.artist }}</p>
          <p><strong>Release Date:</strong> {{ album.release_date }}</p>
          <p><strong>Votes:</strong> {{ album.votes_count }}</p>
        </div>

        <!-- Hide vote buttons for Admins -->
        <div v-if="!isAdmin" class="actions">
          <button
            @click="toggleVote(album.id, 'upvote')"
            :class="{ active: album.userVote === 'upvote' }"
          >
            Upvote
          </button>
          <button
            @click="toggleVote(album.id, 'downvote')"
            :class="{ active: album.userVote === 'downvote' }"
          >
            Downvote
          </button>          
        </div>
        <div class="actions">
          <!-- Delete button (Only for Admins) -->
          <button v-if="isAdmin" @click="deleteAlbum(album.id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else>No albums found.</p>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="currentPage--" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage * itemsPerPage >= filteredAlbums.length"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAlbumStore } from "@/stores/album";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";

const albumStore = useAlbumStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const isAdmin = authStore.isAdmin;
const userRole = authStore.getUserRole;

// Fetch albums when the component is mounted
onMounted(() => {
  // authStore.fetchUser();
  albumStore.fetchAlbums();
});

// **Search Functionality**
const filteredAlbums = computed(() => {
  return albumStore.albums
    .filter((album) =>
      album.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => {
      if (b.votes === a.votes) return a.title.localeCompare(b.title); // Alphabetical sort if votes are equal
      return b.votes - a.votes; // Sort by votes
    });
});

// **Pagination Logic**
const paginatedAlbums = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredAlbums.value.slice(start, start + itemsPerPage);
});

// **Vote Handling**
const toggleVote = (albumId: number, voteType: "upvote" | "downvote") => {
  albumStore.toggleVote(albumId, voteType);
};

// **Delete Album (Admin Only)**
const deleteAlbum = (albumId: number) => {
  if (confirm("Are you sure you want to delete this album?")) {
    albumStore.deleteAlbum(albumId);
  }
};

const logout = async () => {
  try {
    await api.post("/logout"); // Send logout request to backend
    authStore.logout(); // Clear auth state
    router.push({ name: "Home" }); // Redirect to login page
  } catch (error) {
    console.error("Logout failed", error);
  }
};
</script>