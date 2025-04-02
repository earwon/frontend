import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAlbumStore = defineStore("albums", {
  state: () => ({
    albums: [] as Array<{ id: number; title: string; artist: string; release_date: string; votes: number }>,
    searchQuery: "",
    sortBy: "votes",
  }),
  getters: {
    filteredAlbums(state) {
      return state.albums
        .filter((album) => album.title.includes(state.searchQuery) || album.artist.includes(state.searchQuery))
        .sort((a, b) => (state.sortBy === "votes" ? b.votes - a.votes : a.title.localeCompare(b.title)));
    },
  },
  actions: {
    async fetchAlbums() {
      const response = await api.get("/albums");
      this.albums = response.data.data;
    },
    async vote(albumId: number, type: "up" | "down") {
      await api.post(`/albums/${albumId}/vote`, { type });
      await this.fetchAlbums();
    },
    async deleteAlbum(albumId: number) {
      await api.delete(`/albums/${albumId}`);
      this.albums = this.albums.filter((album) => album.id !== albumId);
    },
  },
});