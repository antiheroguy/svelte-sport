<script>
	import {
		AccordionContent,
		Badge,
		BlockTitle,
		Card,
		Link,
		List,
		ListItem,
		Page,
		Tab,
		Tabs,
		Toolbar,
		useStore
	} from 'framework7-svelte'
	import { onMount } from 'svelte'
	import groupBy from 'lodash/groupBy'
	import {
		getLeagueLastMatches,
		getLeagueNextMatches,
		getLeagueTable,
		getSeasonMatches,
		getLeagueSeasons,
		getMatchHighlights,
		getLiveMatches
	} from '@/libs/api'
	import Header from '@/components/Header.svelte'
	import Highlight from '@/components/Highlight.svelte'
	import Match from '@/components/Match.svelte'
	import { SMART_SELECT_PARAMS, FORM_BADGE } from '@/js/constants'
	import { fallback } from '@/libs/directives'

	export let f7route
	export let league = {}

	const id = f7route.params.id

	let date = useStore('date', (value) => (date = value))

	let lastMatches = []
	let nextMatches = []
	let histories = []
	let standingSeason = ''
	let historySeason = ''
	let seasons = []
	let standings = []
	let highlights = []
	let liveMatches = []

	$: standingSeason, fetchStandings()
	$: historySeason, fetchHistories()
	$: date, fetchHighlights()

	const fetchLeagueData = async () => {
		const seasonData = await getLeagueSeasons(id)
		seasons = seasonData.reverse()
		standingSeason = league.strCurrentSeason
		historySeason = league.strCurrentSeason
		getLiveMatches(null, id).then((data) => (liveMatches = data))
		getLeagueLastMatches(id).then((data) => (lastMatches = data))
		getLeagueNextMatches(id).then((data) => (nextMatches = data))
	}

	let fetchHistories = async () => {
		histories = []
		const matches = await getSeasonMatches(id, historySeason)
		histories = Object.entries(groupBy(matches, 'intRound')).map(([round, matches]) => ({
			matches,
			round
		}))
	}

	const fetchHighlights = () => {
		getMatchHighlights(date, null, id).then((data) => (highlights = data))
	}

	let fetchStandings = () => {
		getLeagueTable(id, standingSeason).then((data) => (standings = data))
	}

	onMount(() => {
		fetchLeagueData()
	})
</script>

<Page name="league">
	<Header title={league.strLeague} subtitle={league.strCountry} logo={league.strBadge} />
	<Toolbar bottom tabbar icons>
		<Link tabLink="#tab-league-match" text="Matches" iconF7="alarm" tabLinkActive />
		<Link tabLink="#tab-league-standing" text="Standings" iconF7="list_number" />
		<Link tabLink="#tab-league-history" text="Histories" iconF7="book" />
		<Link tabLink="#tab-league-highlight" text="Highlights" iconF7="film" />
	</Toolbar>
	<Tabs animated>
		<Tab id="tab-league-match" class="py-0 page-content" tabActive>
			{#if liveMatches.length}
				<BlockTitle medium>Live Matches</BlockTitle>
				<List mediaList>
					{#each liveMatches as match}
						<Match {match} />
					{/each}
				</List>
			{/if}
			{#if lastMatches.length}
				<BlockTitle medium>Last Matches</BlockTitle>
				<List mediaList>
					{#each lastMatches as match}
						<Match {match} />
					{/each}
				</List>
			{/if}
			{#if nextMatches.length}
				<BlockTitle medium>Next Matches</BlockTitle>
				<List mediaList>
					{#each nextMatches as match}
						<Match {match} />
					{/each}
				</List>
			{/if}
		</Tab>
		<Tab id="tab-league-standing" class="py-0 page-content">
			{#if seasons.length}
				<List>
					<ListItem
						class="hover:bg-blue-500"
						title="Choose Season"
						smartSelect
						smartSelectParams={SMART_SELECT_PARAMS}
						noChevron
					>
						<select bind:value={standingSeason}>
							{#each seasons as item}
								<option value={item.strSeason}>{item.strSeason}</option>
							{/each}
						</select>
					</ListItem>
				</List>
			{/if}
			{#if standings.length}
				<Card class="data-table">
					<table>
						<thead>
							<tr>
								<th class="text-center">#</th>
								<th class="text-center">Team</th>
								<th class="text-center">M</th>
								<th class="text-center">W</th>
								<th class="text-center">D</th>
								<th class="text-center">L</th>
								<th class="text-center">G</th>
								<th class="text-center">GD</th>
								<th class="text-center">PTS</th>
								<th class="text-center">Form</th>
							</tr>
						</thead>
						<tbody>
							{#each standings as team}
								<tr>
									<td class="text-center">{team.intRank}</td>
									<td class="text-center">
										<Link
											href={`/team/${team.idTeam}`}
											class="flex items-center justify-start truncate w-36"
										>
											<img use:fallback src={team.strTeamBadge} alt={team.strTeam} class="w-4" />
											<span class="inline-block ml-2">{team.strTeam}</span></Link
										>
									</td>
									<td class="text-center">{team.intPlayed}</td>
									<td class="text-center">{team.intWin}</td>
									<td class="text-center">{team.intDraw}</td>
									<td class="text-center">{team.intLoss}</td>
									<td class="text-center">{team.intGoalsFor}:{team.intGoalsAgainst}</td>
									<td class="text-center">{team.intGoalDifference}</td>
									<td class="text-center">{team.intPoints}</td>
									<td class="text-center">
										<div class="flex items-center">
											{#each team.strForm.split('') as form}
												<Badge class="m-1" color={FORM_BADGE[form]}>{form}</Badge>
											{/each}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</Card>
			{/if}
		</Tab>
		<Tab id="tab-league-highlight" class="py-0 page-content" on:tabShow={fetchHighlights}>
			<List mediaList>
				{#if highlights.length}
					{#each highlights as match}
						<Highlight {match} />
					{/each}
				{/if}
			</List>
		</Tab>
		<Tab id="tab-league-history" class="py-0 page-content">
			{#if seasons.length}
				<List>
					<ListItem
						class="hover:bg-blue-500"
						title="Choose Season"
						smartSelect
						smartSelectParams={SMART_SELECT_PARAMS}
						noChevron
					>
						<select bind:value={historySeason}>
							{#each seasons as item}
								<option value={item.strSeason}>{item.strSeason}</option>
							{/each}
						</select>
					</ListItem>
				</List>
			{/if}
			<List strong outlineIos dividersIos insetMd accordionList>
				{#each histories as { matches, round, isOpen }}
					<ListItem accordionItem title={`Round ${round}`} accordionItemOpened={isOpen}>
						<AccordionContent>
							{#each matches as match}
								<Match {match} />
							{/each}
						</AccordionContent>
					</ListItem>
				{/each}
			</List>
		</Tab>
	</Tabs>
</Page>
