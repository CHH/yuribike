<template>
  <section class="container">
    <div class="fixed z-10 pin-l pin-t mt-8 ml-8 bg-white w-1/4 shadow-lg rounded-lg max-h-screen overflow-y-auto">
      <div class="flex mt-4 ml-4 mr-4 mb-0">
        <i class="fas fa-bicycle fa-2x fa-fw self-center"></i>
        <h1 class="flex-1 self-center pl-4">YURIBIKE</h1>
      </div>

      <form action="" class="p-4" @submit.prevent="search">
        <input
          type="search"
          class="w-full rounded-lg p-3 bg-grey-lighter"
          placeholder="Gib deine Stadt ein"
          v-model="searchQuery"
        />
      </form>

      <!-- Results -->

      <section class="pb-4">
        <h2 class="font-black text-red pl-4 pr-4">Deine Favoriten</h2>

        <article class="relative flex hover:bg-grey-lighter rounded" v-for="city in favorites" :key="`favorite-${city.uid}`">
          <div class="flex pt-2 pb-2 pr-2 pl-4 self-center">
            <i class="fas fa-heart fa-2x fa-fw text-red" aria-hidden="true"></i>
          </div>
          <div class="flex-1 pl-2 pt-2 pb-2 pr-2 self-center">
            <h3 class="mt-0 mb-1">
              {{ city.name }}
            </h3>
            <p class="text-grey-dark mb-0">
              {{ city.available_bikes }} verfügbar
            </p>
            <button class="absolute pin-r pin-t w-full h-full pr-4 text-right" @click="showCity(city)">
              <i class="fas fa-chevron-circle-right text-red"></i>
            </button>
          </div>
        </article>
      </section>

      <section class="pb-4">
        <h2 class="font-black text-yellow-dark pl-4 pr-4">In deiner Nähe</h2>

        <article class="relative flex hover:bg-grey-lighter rounded" v-for="city in cities" :key="city.uid">
          <div class="flex pt-2 pb-2 pr-2 pl-4 self-center">
            <i class="fas fa-map-marker fa-2x fa-fw text-yellow-dark" aria-hidden="true"></i>
          </div>
          <div class="flex-1 pl-2 pt-2 pb-2 pr-2 self-center">
            <h3 class="mt-0 mb-1">
              {{ city.name }}
            </h3>
            <p class="text-grey-dark mb-0">
              {{ city.available_bikes }} verfügbar
            </p>
            <button class="absolute pin-r pin-t w-full h-full pr-4 text-right" @click="showCity(city)">
              <i class="fas fa-chevron-circle-right text-yellow-dark"></i>
            </button>
          </div>
        </article>
      </section>

      <section v-if="current" class="pb-4">
        <h2 class="font-black text-yellow-dark pl-4 pr-4">{{ current.name }}</h2>

        <form class="pl-4 pr-4 pt-3 pb-2" v-if="current.places.length > 1">
          <select
            class="w-full"
            name="place"
            id="place"
            @change="selectPlace($event.target.value)"
          >
            <option v-for="place in current.places" :key="place.uid" :value="place.uid">
              {{ place.name }}
            </option>
          </select>
        </form>

        <article class="pl-4 pr-4 pt-2 pb-2">
          <header class="flex">
            <h3 class="flex-1 mt-1 mb-1">
              {{ place.name }}
            </h3>
            <button class="self-center" aria-label="Anzeigen" @click="selectPlace(place.uid)">
              <i class="fas fa-search-plus text-grey" aria-hidden="true"></i>
            </button>
          </header>

          <article v-for="(count, type) in place.bike_types" :key="type" class="flex">
            <div class="flex self-center pt-2 pb-2 pr-2">
              <i class="fas fa-bicycle fa-fw fa-2x" :class="{'text-green': count > 0, 'text-red': count === 0}"></i>
            </div>
            <div class="flex-1 self-center pl-2 pt-2 pb-2 pr-2">
              <h4>
                <span v-if="type == 4">CLASSICbike</span>
                <span v-else-if="type == 5">e-CLASSICbike</span>
                <span v-else-if="type == 'undefined'">ECObike</span>
              </h4>
              <p class="text-grey-dark">
                {{ count }} verfügbar
              </p>
            </div>
            <div class="flex self-center">
              <button class="rounded pt-2 pb-2 pl-3 pr-3 text-white font-bold" :class="{'bg-green-dark': count > 0, 'bg-grey': count === 0}">
                Fahren
              </button>
            </div>
          </article>
        </article>
      </section>

      <p class="text-grey text-sm p-4">
        Daten: Creative Commons Namensnennung 3.0 Österreich nextbike GmbH
      </p>
    </div>

    <no-ssr>
      <app-map :center="mapCenter" :zoom="mapZoom" :fly="mapFly" />
    </no-ssr>
  </section>
</template>

<script>
import AppMap from '~/components/AppMap'
import axios from 'axios'

export default {
  components: {
    AppMap
  },
  async asyncData () {
    const { data: { countries } } = await axios.get('http://nextbike.net/maps/nextbike-official.json?domains=la,at')
    const cities = countries[0].cities

    const favoriteCityNames = ['Amstetten']

    const favorites = cities.filter(city => {
      return favoriteCityNames.indexOf(city.name) !== -1
    })

    return {
      country: countries[0],
      mapCenter: {
        lng: 14.87, lat: 48.125
      },
      mapZoom: 12,
      favorites,
      cities: cities.filter(city => {
        return ['Amstetten', 'Lunz am See', 'St.Pölten'].indexOf(city.name) !== -1
      }),
      current: null,
      place: null,
      mapFly: null,
      searchQuery: null,
    }
  },
  methods: {
    showCity (city) {
      this.$set(this, 'mapFly', {
        center: {
          lng: city.lng, lat: city.lat,
        },
        zoom: city.zoom,
      })
      this.current = city
      this.place = city.places[0]
    },

    selectPlace (uid) {
      this.place = this.current.places.filter(place => place.uid == uid)[0]

      this.$set(this, 'mapFly', {
        center: {
          lng: this.place.lng, lat: this.place.lat,
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
