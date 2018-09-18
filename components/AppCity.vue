<template>
  <section class="city">
    <div class="flex">
      <h2 class="flex-1 font-black text-yellow-dark pl-4 pr-4">{{ city.name }}</h2>
      <div v-if="favorites" class="mr-4 self-center">
        <button @click="toggleLike">
          <i class="fas fa-heart fa-fw text-grey" :class="{'text-red': favorites.indexOf(`${city.uid}`) !== -1}"></i>
        </button>
      </div>
    </div>

    <form class="pl-4 pr-4 pt-3 pb-2" v-if="city.places.length > 1" action="">
      <select
        class="w-full"
        name="place"
        id="place"
        @change="selectPlace($event.target.value)"
      >
        <option v-for="place in city.places" :key="place.uid" :value="place.uid">
          {{ place.name }}
        </option>
      </select>
    </form>

    <app-place
      class="pt-2"
      :place="place"
    />
  </section>
</template>

<script>
import AppPlace from '~/components/AppPlace'
import axios from 'axios'

export default {
  components: {
    AppPlace,
  },
  props: {
    city: {
      type: Object,
      required: true,
    }
  },
  async created () {
    const { data: { favorites } } = await axios.get(`/api/favorites`)
    this.favorites = favorites
  },
  data () {
    return {
      favorites: null,
      place: this.city.places[0] || null
    }
  },
  methods: {
    selectPlace (uid) {
      this.place = this.city.places.filter(place => place.uid == uid)[0]

      this.$emit('change-place', this.place)
    },

    async toggleLike () {
      let req

      if (this.favorites.indexOf(`${this.city.uid}`) !== -1) {
        req = axios.delete(`/api/favorites/${this.city.uid}`)
      } else {
        req = axios.put(`/api/favorites/${this.city.uid}`)
      }

      const { data: { favorites } } = await req

      this.favorites = favorites
    }
  }
}
</script>
