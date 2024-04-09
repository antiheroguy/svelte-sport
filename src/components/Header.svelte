<script>
	import { Button, List, ListInput, ListItem, Navbar, NavRight, f7 } from 'framework7-svelte'
	import { onMount, onDestroy } from 'svelte'
	import debounce from 'lodash/debounce'
	import { fallback } from '@/libs/directives'
	import { searchTeams, searchPlayers, searchMatches } from '@/libs/api'
	import store from '@/js/store'

	export let title = ''
	export let subtitle = ''
	export let logo = ''
	export let backLink = true

	let autocompleteRef
	let dateRef
	let results = []
	let date = [new Date()]

	const searchAll = async (event) => {
		const promises = [searchTeams(event), searchPlayers(event), searchMatches(event)]
		const [teams, players, matches] = await Promise.all(promises)
		const searchableTeams =
			teams?.map((item) => ({
				name: item.strTeam,
				logo: item.strTeamBadge,
				link: `/team/${item.idTeam}`,
				data: item
			})) || []
		const searchablePlayers =
			players?.map((item) => ({
				name: item.strPlayer,
				logo: item.strCutout,
				link: `/player/${item.idPlayer}`,
				data: item
			})) || []
		const searchableMatches =
			matches?.map((item) => ({
				name: item.strEvent,
				logo: item.strSquare,
				link: `/match/${item.idEvent}`,
				data: item
			})) || []

		return [...searchableTeams, ...searchablePlayers, ...searchableMatches].toSorted((a, b) =>
			a.name.localeCompare(b.name)
		)
	}

	const openCalendar = () => dateRef.calendarInstance().open()

	const setDate = (event) => {
		store.dispatch('setDate', event.target.value)
	}

	onMount(() => {
		autocompleteRef = f7.autocomplete.create({
			autoFocus: true,
			closeOnSelect: true,
			closeOnSelect: true,
			openerEl: '#search-button a',
			openIn: 'popup',
			pageTitle: 'Search',
			source: debounce(async (query, render) => {
				autocompleteRef.preloaderShow()
				results = await searchAll(query)
				autocompleteRef.preloaderHide()
				render(results)
			}, 200),
			textProperty: 'name',
			typeahead: true,
			valueProperty: 'link',
			renderItem(item) {
				const result = results.find((entry) => entry.link === item.value)
				return `
					<li class="hover:bg-blue-500">
						<label class="item-radio item-content" data-value="${item.value}">
							<input type="radio" name="radio" value="${item.value}">
							<div class="w-full item-inner">
								<div class="w-full item-title">
									<a class="flex items-center justify-start block w-full m-0 truncate link" href="${result.link}"> 
										<img src="${result.logo || `https://placehold.co/32?text=${item.text}`}" alt="${item.text}" class="w-8"> 
										<span class="inline-block ml-2">${item.text}</span> 
									</a>
								</div>
							</div>
						</label>
					</li>
				`
			}
		})
	})

	onDestroy(() => {
		autocompleteRef.destroy()
	})
</script>

<Navbar {backLink}>
	<List mediaList>
		<ListItem {title} {subtitle}>
			<img use:fallback slot="media" src={logo} class="w-12" alt={title} />
		</ListItem>
	</List>
	<NavRight>
		<Button iconF7="search" round on:click={autocompleteRef.open()} id="search-button" />
		<Button iconF7="calendar" round on:click={openCalendar} />
	</NavRight>
</Navbar>

<List class="hidden" strongIos outlineIos>
	<ListInput
		bind:value={date}
		type="datepicker"
		placeholder="Date"
		onChange={setDate}
		calendarParams={{
			openIn: 'customModal',
			closeOnSelect: true,
			dateFormat: 'yyyy-mm-dd'
		}}
		bind:this={dateRef}
	/>
</List>
