import IDs from "@/store/mock/imdb_top250";
import axios from "@/plugins/axios";
import mutations from "@/store/mutations";

const { MOVIES, CURRENT_PAGE, REMOVE_MOVIE, TOGGLE_SEARCH } = mutations;

async function getMovies(idsArray) {
  const requests = idsArray.map(id => axios.get(`/?i=${id}`));
  return await Promise.all(requests);
}

function serializeResponse(movies) {
  return movies.reduce((acc, movie) => {
    acc[movie.imdbID] = movie;
    if (movie.Poster === "N/A") {
      movie.Poster =
        "https://raw.githubusercontent.com/olga-gaga/movies-app/main/src/assets/No_image_poster.png";
    }
    return acc;
  }, {});
}

const moviesStore = {
  namespaced: true,
  state: {
    isSearch: false,
    top250IDs: IDs,
    moviesPerPage: 12,
    currentPage: 1,
    movies: {}
  },
  getters: {
    moviesList: ({ movies }) => movies,
    slicedIDs: ({ top250IDs }) => (from, to) => top250IDs.slice(from, to),
    currentPage: ({ currentPage }) => currentPage,
    moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
    moviesLength: ({ top250IDs }) => Object.keys(top250IDs).length || 0,
    isSearch: ({ isSearch }) => isSearch,
    noPoster: ({ noPoster }) => noPoster,
    range: ({ currentPage, moviesPerPage }) => ({
      from: currentPage * moviesPerPage - moviesPerPage,
      to: currentPage * moviesPerPage
    })
  },
  mutations: {
    [MOVIES](state, value) {
      state.movies = value;
    },
    [CURRENT_PAGE](state, value) {
      state.currentPage = value;
    },
    [REMOVE_MOVIE](state, index) {
      state.top250IDs.splice(index, 1);
    },
    [TOGGLE_SEARCH](state, bool) {
      state.isSearch = bool;
    }
  },
  actions: {
    async fetchMovies({ getters, commit, dispatch }) {
      try {
        dispatch("toggleLoader", true, { root: true });
        const {
          range: { from, to },
          slicedIDs
        } = getters;

        const moviesToFetch = slicedIDs(from, to);
        const response = await getMovies(moviesToFetch);
        const movies = serializeResponse(response);

        commit(MOVIES, movies);
      } catch (error) {
        console.log(error);
        dispatch(
          "showNotify",
          {
            message: error.message,
            title: "Error"
          },
          { root: true }
        );
      } finally {
        dispatch("toggleLoader", false, { root: true });
      }
    },
    changeCurrentPage({ commit, dispatch }, page) {
      commit(CURRENT_PAGE, page);
      dispatch("fetchMovies");
    },
    removeMovie({ commit, dispatch, state: { top250IDs } }, id) {
      const index = top250IDs.findIndex(item => item === id);
      if (index !== -1) {
        commit(REMOVE_MOVIE, index);
        dispatch("fetchMovies");
      }
    },
    async searchMovies({ commit, dispatch }, query) {
      try {
        dispatch("toggleLoader", true, { root: true });

        const response = await axios.get(`/?s=${query}`);
        if (response.Error) {
          throw Error(response.Error);
        }

        const searchIDs = response.Search.map(({ imdbID }) => imdbID);
        const searchResponse = await getMovies(searchIDs);
        const movies = serializeResponse(searchResponse);

        commit(MOVIES, movies);
      } catch (error) {
        console.log(error.message);
        dispatch(
          "showNotify",
          {
            message: error.message,
            title: "Error"
          },
          { root: true }
        );
      } finally {
        dispatch("toggleLoader", false, { root: true });
      }
    },
    toggleSearchState({ commit }, bool) {
      commit(TOGGLE_SEARCH, bool);
    }
  }
};

export default moviesStore;
