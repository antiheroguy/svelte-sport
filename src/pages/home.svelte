<script>
	import {
		AccordionContent,
		BlockTitle,
		Button,
		Link,
		List,
		ListItem,
		Page,
		Segmented,
		Tab,
		Tabs,
		Toolbar,
		useStore
	} from 'framework7-svelte'
	import dayjs from 'dayjs'
	import Header from '@/components/Header.svelte'
	import Highlight from '@/components/Highlight.svelte'
	import Match from '@/components/Match.svelte'
	import { SMART_SELECT_PARAMS } from '@/js/constants'
	import { fallback } from '@/libs/directives'
	import {
		getLeaguesByCondition,
		getLiveMatches,
		getMatchesByCondition,
		getMatchHighlights,
		getTVMatchesByCondition
	} from '@/libs/api'
	import logo from '@/images/logo.png'

	let sportRef
	let matches = []
	let tvMatches = []
	let liveMatches = []
	let highlights = []
	let sport = useStore('sport', (value) => (sport = value))
	let date = useStore('date', (value) => (date = value))
	let sports = useStore('sports', (value) => (sports = value))
	let countries = useStore('countries', (value) => (countries = value))

	$: hotSports = sports.slice(0, 4)
	$: [date, sport], [fetchMatches(), fetchTVMatches(), fetchHighlights()]
	$: [sport], fetchLiveMatches()

	let fetchLeagues = (c) => {
		getLeaguesByCondition(c, sport).then((data) => {
			const index = countries.findIndex((item) => item.name_en === c)
			countries[index].leagues = data.toSorted((a, b) => a.strLeague - b.strLeague)
		})
	}

	let fetchMatches = () => {
		getMatchesByCondition(date, sport, null).then(
			(data) =>
				(matches = data.toSorted(
					(a, b) => dayjs(b.strTimestamp).valueOf() - dayjs(a.strTimestamp).valueOf()
				))
		)
	}

	let fetchTVMatches = () => {
		getTVMatchesByCondition(date, null, sport).then(
			(data) =>
				(tvMatches = data.toSorted(
					(a, b) => dayjs(b.strTimeStamp).valueOf() - dayjs(a.strTimeStamp).valueOf()
				))
		)
	}

	let fetchLiveMatches = () => {
		getLiveMatches(sport, null).then((data) => (liveMatches = data))
	}

	let fetchHighlights = () => {
		getMatchHighlights(date, sport, null).then((data) => (highlights = data))
	}

	let fetchAllMatches = () => {
		fetchMatches()
		fetchLiveMatches()
	}

	const openSportSelector = () => sportRef.smartSelectInstance().open()

	const setSport = (data) => (sport = data)
</script>

<Page name="home">
	<Header backLink={false} title="Svelte Sport" subtitle="Sport highlights and fixures" {logo} />
	{#if hotSports.length}
		<Segmented tag="p">
			{#each hotSports as item}
				<Button
					class="!rounded-none flex items-center"
					active={item.strSport === sport}
					onClick={() => setSport(item.strSport)}
				>
					<img use:fallback alt={item.strSport} src={item.strSportIconGreen} class="w-4" />
					<span class="mx-1">{item.strSport}</span>
				</Button>
			{/each}
			<Button
				class="!rounded-none"
				active={!hotSports.map((item) => item.strSport).includes(sport)}
				onClick={openSportSelector}
			>
				<span class="mx-1">More</span>
			</Button>
		</Segmented>
		<List class="hidden">
			<ListItem
				class="hover:bg-blue-500"
				title="Sports"
				smartSelect
				smartSelectParams={SMART_SELECT_PARAMS}
				bind:this={sportRef}
			>
				<select bind:value={sport}>
					{#each sports as sport}
						<option value={sport.strSport}>{sport.strSport}</option>
					{/each}
				</select>
			</ListItem>
		</List>
	{/if}
	<Toolbar bottom tabbar icons>
		<Link tabLink="#tab-match" text="Matches" iconF7="alarm" tabLinkActive />
		<Link tabLink="#tab-league" text="Leagues" iconF7="chart_bar" />
		<Link tabLink="#tab-highlight" text="Highlights" iconF7="film" />
		<Link tabLink="#tab-tv" text="TV" iconF7="tv" />
	</Toolbar>
	<Tabs animated>
		<Tab id="tab-match" class="py-0 page-content" on:tabShow={fetchAllMatches} tabActive>
			{#if liveMatches.length}
				<BlockTitle medium>Live Matches</BlockTitle>
				<List mediaList>
					{#each liveMatches as match}
						<Match {match} />
					{/each}
				</List>
			{/if}
			{#if matches.length}
				<BlockTitle medium>Results</BlockTitle>
				<List mediaList>
					{#each matches as match}
						<Match {match} />
					{/each}
				</List>
			{/if}
		</Tab>
		<Tab id="tab-league" class="py-0 page-content">
			{#if countries.length}
				<List strong outlineIos dividersIos insetMd accordionList>
					{#each countries as item}
						<ListItem
							accordionItem
							title={item.name_en}
							on:accordionBeforeOpen={fetchLeagues(item.name_en)}
						>
							<AccordionContent>
								<BlockTitle medium class="px-4"
									>Leagues {item?.leagues?.length ? `(${item.leagues.length})` : ''}</BlockTitle
								>
								<List dividersIos outlineIos strongIos mediumInset>
									{#each item.leagues || [] as league}
										<ListItem
											class="hover:bg-blue-500"
											link={`/league/${league.idLeague}`}
											title={league.strLeague}
											after={league.strCurrentSeason}
											noChevron
										>
											<img
												use:fallback
												slot="media"
												alt={league.strLeague}
												src={league.strBadge}
												class="w-12"
											/>
										</ListItem>
									{/each}
								</List>
							</AccordionContent>
						</ListItem>
					{/each}
				</List>
			{/if}
		</Tab>
		<Tab id="tab-tv" class="py-0 page-content" on:tabShow={fetchTVMatches}>
			{#if tvMatches.length}
				<List mediaList>
					{#each tvMatches as match}
						<ListItem
							class="hover:bg-blue-500"
							title={match.strEvent}
							after={match.strTimeStamp}
							footer={match.strChannel}
						>
							<img
								use:fallback
								slot="media"
								src={match.strLogo}
								class="w-12"
								alt={match.strEvent}
							/>
						</ListItem>
					{/each}
				</List>
			{/if}
		</Tab>
		<Tab id="tab-highlight" class="py-0 page-content" on:tabShow={fetchHighlights}>
			{#if highlights.length}
				<List mediaList>
					{#each highlights as match}
						<Highlight {match} />
					{/each}
				</List>
			{/if}
		</Tab>
	</Tabs>
</Page>
