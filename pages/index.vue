<template>
  <section class="container">
    <div class="fixed z-10 pin-l pin-t mt-8 ml-8 bg-white w-1/4 shadow-lg rounded-lg max-h-screen overflow-y-auto">
      <div class="flex mt-4 ml-4 mr-4 mb-0">
        <i class="fas fa-bicycle fa-2x fa-fw self-center"></i>
        <h1 class="flex-1 self-center pl-4 font-black tracking-wide">
          YURI<span class="text-yellow-dark">BIKE</span>
        </h1>
      </div>

      <form action="" class="p-4" @submit.prevent="search">
        <input
          type="search"
          class="w-full rounded-lg p-3 bg-grey-lighter leading-normal font-bold"
          placeholder="Gib deine Stadt ein"
          v-model="searchQuery"
        />
      </form>

      <!-- Results -->

      <section class="pb-4" v-if="cities">
        <h2 class="font-black text-yellow-dark pl-4 pr-4">Deine Favoriten</h2>

        <app-city-list-item
          v-for="city in favorites"
          :key="`favorite-${city.uid}`"
          :city="city"
          @click="showCity(city)"
          icon="fa-heart"
          icon-color="text-red"
        />
      </section>

      <section class="pb-4">
        <h2 class="font-black text-yellow-dark pl-4 pr-4">In deiner Nähe</h2>

        <app-city-list-item
          v-for="city in recommended"
          :key="city.uid"
          :city="city"
          @click="showCity(city)"
        />
      </section>

      <section v-if="city" class="pb-4">
        <app-city
          :city="city"
          @change-place="showPlace($event)"
        />
      </section>

      <p class="text-grey-dark text-sm p-4 bg-grey-lighter font-semibold shadow-inner">
        Daten: © nextbike GmbH (CC-Namensnennung 3.0 Österreich)
      </p>
    </div>

    <no-ssr>
      <app-map :center="mapCenter" :zoom="mapZoom" :fly="mapFly" />
    </no-ssr>
  </section>
</template>

<script>
import AppMap from '~/components/AppMap'
import AppCityListItem from '~/components/AppCityListItem'
import AppCity from '~/components/AppCity'
import axios from 'axios'

export default {
  components: {
    AppMap,
    AppCityListItem,
    AppCity,
  },

  async asyncData () {
    return {
      country: null,
      mapCenter: {
        lng: 14.87, lat: 48.125
      },
      mapZoom: 12,
      cities: null,
      recommended: null,
      city: null,
      place: null,
      mapFly: null,
      searchQuery: null,
    }
  },

  computed: {
    favorites () {
      if (this.$store.state.favorites.length === 0) {
        return []
      }

      return this.cities.filter(city => {
        return this.$store.state.favorites.indexOf(`${city.uid}`) !== -1
      })
    }
  },

  async created () {
    await this.$store.dispatch('getFavorites')

    const { data: { countries } } = await axios.get('http://nextbike.net/maps/nextbike-official.json?domains=la,at')
    const { cities } = countries[0]

    this.country = countries[0]
    this.cities = cities

    this.recommended = cities.filter(city => {
      return ['Amstetten', 'Lunz am See', 'St.Pölten'].indexOf(city.name) !== -1
    })
  },

  methods: {
    showCity (city) {
      this.$set(this, 'mapFly', {
        center: {
          lng: city.lng, lat: city.lat,
        },
        zoom: city.zoom,
      })
      this.city = city
      this.place = city.places[0]
      this.searchQuery = city.name
    },

    showPlace (place) {
      if (!place) {
        return
      }

      this.$set(this, 'mapFly', {
        center: {
          lng: place.lng, lat: place.lat,
        },
        zoom: 16,
      })
    },

    search () {
      const query = this.searchQuery

      const result = this.country.cities.filter(city => {
        return city.name.startsWith(query)
      })

      if (result.length > 0) {
        this.showCity(result[0])
      }
    }
  }
}
</script>

<style>
</style>
