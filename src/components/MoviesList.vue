<template>
  <div class="movies-list">
    <BContainer>
      <h3 class="list-title">{{ listTitle }}</h3>
      <BRow>
        <template v-if="isExist">
          <BCol cols="3" v-for="(movie, key) in list" :key="key">
            <MovieItem
              :movie="movie"
              @mouseover.native="onMouseOver(movie.Poster)"
              @removeMovie="onRemoveMovie"
              @showModal="onShowMovieInfo"
            />
          </BCol>
        </template>
        <template v-else>Empty list</template>
      </BRow>
      <BModal
        body-class="movie-modal-body"
        content-class="movie-modal-content"
        :id="movieInfoModalID"
        size="xl"
        hide-footer
        hide-header
      >
        <MovieInfoModalContent :movie="selectedMovie" @closeModal="onCloseModal"/>
      </BModal>
    </BContainer>
  </div>
</template>

<script>
import MovieItem from "./MovieItem.vue";
import MovieInfoModalContent from "./MovieInfoModalContent.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MoviesList",
  props: {
    list: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    movieInfoModalID: "movie-info",
    selectedMovieID: "",
  }),
  components: {
    MovieItem,
    MovieInfoModalContent
  },
  computed: {
    ...mapGetters("movies", ["isSearch"]),
    listTitle() {
      return this.isSearch ? "Search result" : "IMDB Top 250";
    },
    isExist() {
      return Boolean(Object.keys(this.list).length);
    },
    selectedMovie() {
      return this.selectedMovieID ? this.list[this.selectedMovieID] : null;
    }
  },
  methods: {
    ...mapActions("movies", ["removeMovie"]),
    ...mapActions(["showNotify"]),
    onMouseOver(poster) {
      this.$emit("changePoster", poster);
    },
    async onRemoveMovie({ id, title = '' }) {
      const isConfirmed = await this.$bvModal.msgBoxConfirm(`Are you sure delete "${title}"?`);
      if (isConfirmed) {
        this.removeMovie(id);
        this.showNotify({
          message: "Movie deleted successful",
          title: "Success",
          variant: "success" 
        }, 
        { root: true });
      }
    },
    onShowMovieInfo(id) {
      console.log(id);
      this.selectedMovieID = id;
      this.$bvModal.show(this.movieInfoModalID);
    },
    onCloseModal() {
      this.selectedMovieID = null;
      this.$bvModal.hide(this.movieInfoModalID);
    }
  }
};
</script>

<style scoped>
.movies-list {
  margin-bottom: 30px;
}
.list-title {
  font-size: 30px;
  margin-bottom: 30px;
  color: #fff;
}
</style>

<style>
.movie-modal-content {
  border:0 !important;
}

.movie-modal-body {
  padding: 0 !important;
}
</style>
