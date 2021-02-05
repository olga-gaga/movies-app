<template>
  <div id="app">
    <Loader />
    <Notification />
    <PosterBg :poster="posterBg" />
    <Header />
    <MoviesList
      :list="moviesList"
      :isSearch="isSearch"
      @changePoster="onChangePoster"
    />
    <MoviesPagination
      v-if="!isSearch"
      :current-page="currentPage"
      :per-page="moviesPerPage"
      :total="moviesLength"
      @pageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MoviesList from "@/components/MoviesList.vue";
import PosterBg from "@/components/PosterBg.vue";
import MoviesPagination from "@/components/MoviesPagination.vue";
import Loader from "@/components/Loader.vue";
import Header from "@/components/Header.vue";
import Notification from "@/components/Notification.vue";
export default {
  name: "App",
  components: {
    MoviesList,
    PosterBg,
    MoviesPagination,
    Loader,
    Header,
    Notification
  },
  data: () => ({
    posterBg: ""
  }),
  computed: {
    ...mapGetters("movies", [
      "moviesList",
      "currentPage",
      "moviesPerPage",
      "moviesLength",
      "isSearch"
    ])
  },
  watch: {
    "$route.query": {
      handler: "onPageQueryChange",
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions("movies", ["changeCurrentPage"]),
    onChangePoster(poster) {
      this.posterBg = poster;
    },
    onPageChanged(page) {
      this.$router.push({ query: { page } });
      this.changeCurrentPage(page);
    },
    onPageQueryChange({ page = 1 }) {
      this.changeCurrentPage(Number(page));
    }
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  font-family: Arial, Avenir, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-height: 100vh;
}
</style>
