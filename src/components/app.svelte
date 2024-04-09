<script>
	import { onMount } from 'svelte'

	import { f7ready, App, View } from 'framework7-svelte'

	import { getCountries, getSports } from '@/libs/api'

	import routes from '@/js/routes'
	import store from '@/js/store'

	// Framework7 Parameters
	let f7params = {
		name: 'Svelte Sport', // App name
		theme: 'auto', // Automatic theme detection

		// App store
		store: store,
		// App routes
		routes: routes,

		// Register service worker (only on production build)
		serviceWorker:
			process.env.NODE_ENV === 'production'
				? {
						path: '/service-worker.js'
					}
				: {}
	}

	onMount(() => {
		f7ready(() => {
			getCountries().then((data) =>
				store.dispatch(
					'setCountries',
					data.toSorted((a, b) => a.name_en.localeCompare(b.name_en))
				)
			)
			getSports().then((data) => store.dispatch('setSports', data))
		})
	})
</script>

<App {...f7params}>
	<!-- Your main view, should have "view-main" class -->
	<View browserHistory browserHistorySeparator={''} main class="safe-areas" url="/" />
</App>
