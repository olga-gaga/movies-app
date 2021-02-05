<template>
  <header class="header">
    <BNavbar class="navbar" type="dark" variant="dark">
      <BContainer>
        <BNavbarBrand href="/">MovieDB</BNavbarBrand>
        <BNavForm>
          <BFormInput
            v-model="searchValue"
            debounce="500"
            class="mr-sm-2 search-input"
            placeholder="Search"
          ></BFormInput>
        </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Header",
  data: () => ({
    searchValue: ""
  }),
  watch: {
    searchValue: "onSearchValueChange"
  },
  methods: {
    ...mapActions("movies", [
      "searchMovies",
      "fetchMovies",
      "toggleSearchState"
    ]),
    onSearchValueChange(value) {
      if (value) {
        this.searchMovies(value);
        this.toggleSearchState(true);
      } else {
        this.fetchMovies();
        this.toggleSearchState(false);
      }
    }
  }
};
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

.navbar {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.search-input {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 0, 0, 0.6);
}

.search-input:focus {
  box-shadow: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 0, 0, 0.6);
}
</style>
