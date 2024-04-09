import { createStore } from 'framework7/lite'

const store = createStore({
	state: {
		countries: [],
		sports: [],
		country: 'England',
		sport: 'Soccer',
		date: null
	},
	getters: {
		countries: ({ state }) => state.countries,
		sports: ({ state }) => state.sports,
		country: ({ state }) => state.country,
		sport: ({ state }) => state.sport,
		date: ({ state }) => state.date
	},
	actions: {
		setCountries({ state }, countries) {
			state.countries = countries
		},
		setSports({ state }, sports) {
			state.sports = sports
		},
		setCountry({ state }, country) {
			state.country = country
		},
		setSport({ state }, sport) {
			state.sport = sport
		},
		setDate({ state }, date) {
			state.date = date
		}
	}
})
export default store
