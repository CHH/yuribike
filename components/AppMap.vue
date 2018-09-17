<template>
  <div class="app-map">
    <mapbox
      class="app-map__map"
      :access-token="accessToken"
      :map-options="mapOptions"
      @map-load="mapLoad"
    />
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import axios from 'axios'

export default {
  props: {
    center: {
      type: Object,
      required: true,
      default: () => ({
        lng: 14.87, lat: 48.125
      })
    },
    fly: {
      type: Object,
      required: false,
    },
    zoom: {
      type: Number,
      default: 12,
    }
  },
  components: {
    Mapbox
  },
  data () {
    return {
      mapOptions: {
        style: 'mapbox://styles/mapbox/outdoors-v10',
        center: this.center,
        zoom: this.zoom,
      },
      accessToken: 'pk.eyJ1IjoicHVyZWNhcHMiLCJhIjoiY2ptM2g5cnAyMnl4aDNwcXZnOXpvMXczbCJ9.OJOCA2Luk54V93P_GJEZAw'
    }
  },
  watch: {
    fly (to, from) {
      this.$emit('fly', { ...to })
    }
  },
  created () {

  },
  methods: {
    mapLoad (map) {
      axios.get('http://nextbike.net/maps/nextbike-official.json?domains=la,at').then(res => {
        const country = res.data.countries[0]

        const cities = []
        const places = []

        country.cities.forEach(city => {
          cities.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [city.lng, city.lat],
            },
            properties: {
              'title': `Stadt: ${city.name} (${city.available_bikes} verfügbar)`,
              'icon': 'bicycle'
            }
          })

          city.places.forEach(place => {
            const available = Object.values(place.bike_types).reduce((carry, val) => {
              return carry += val
            }, 0)

            places.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [place.lng, place.lat]
              },
              properties: {
                'title': `${place.name} (${available} verfügbar)`,
                'icon': 'bicycle'
              }
            })
          })
        })

        const data = {
          type: 'FeatureCollection',
          features: [
            ...cities, ...places
          ]
        }

        map.addLayer({
          id: 'bikes',
          type: 'symbol',
          source: {
            type: 'geojson',
            data,
          },
          paint: {
            'text-color': '#222',
            'text-halo-color': 'rgba(255, 255, 255, 0.9)',
            'text-halo-width': 2,
            'icon-color': '#f2d024',
          },
          layout: {
            'icon-image': '{icon}-15',
            'icon-size': 1,
            'text-field': '{title}',
            'text-font': ['Source Sans Pro Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
          }
        })

        this.$on('fly', val => {
          map.flyTo({ ...val })
        })
      })
    }
  }
}
</script>

<style>
.app-map__map {
  width: 100vw;
  height: 100vh;
}
</style>
