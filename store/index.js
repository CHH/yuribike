import Vuex from 'vuex'
import axios from 'axios'

const apiBaseUrl = process.env.VUE_ENV === 'server' && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''

export const state = () => ({
  favorites: [],
})

export const mutations = {
  addFavorite (state, { uid }) {
    if (state.favorites.indexOf(`${uid}`) === -1) {
      state.favorites.push(`${uid}`)
    }
  },

  removeFavorite (state, { uid }) {
    const idx = state.favorites.indexOf(`${uid}`)

    if (idx !== -1) {
      state.favorites.splice(idx, 1)
    }
  },

  resetFavorites (state) {
    state.favorites = []
  },

  setFavorites (state, { favorites }) {
    state.favorites = favorites
  }
}

export const actions = {
  async favorite ({ commit, state }, { uid }) {
    if (state.favorites.indexOf(`${uid}`) !== -1) {
      commit('removeFavorite', { uid })
      await axios.delete(`${apiBaseUrl}/api/favorites/${uid}`)
    } else {
      commit('addFavorite', { uid })
      await axios.put(`${apiBaseUrl}/api/favorites/${uid}`)
    }
  },

  async getFavorites ({ commit }) {
    const { data: { favorites } } = await axios.get(`${apiBaseUrl}/api/favorites`)
    commit('setFavorites', { favorites })
  }
}
