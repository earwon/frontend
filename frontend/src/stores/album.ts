import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAlbumStore = defineStore("album", {
  state: () => ({
    user: null,
    albums: [] as any[], // Ensure albums is always an array
  }),
  actions: {
    async fetchAlbums() {
      try {
        const response = await api.get("/albums");
        this.albums = response.data.albums.data || []; // Fallback to empty array
      } catch (error) {
        console.error("Error fetching albums:", error);
        this.albums = []; // Prevent undefined errors
      }
    },

    async toggleVote(albumId: number, voteType: "upvote" | "downvote") {
      await api.post(`/albums/${albumId}/vote`, { vote: voteType });
      this.fetchAlbums();
    },

    async deleteAlbum(albumId: number) {
      await api.delete(`/albums/${albumId}`);
      this.fetchAlbums();
    },
  },
});
