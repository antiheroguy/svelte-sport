<script>
	import { Page, List, ListItem, Toolbar, Link, Tabs, Tab, Card } from 'framework7-svelte'
	import { getMatchLineup, getMatchStatistics, getMatchTimeline, getMatchTV } from '@/libs/api'
	import Header from '@/components/Header.svelte'
	import Match from '@/components/Match.svelte'
	import Player from '@/components/Player.svelte'
	import { fallback } from '@/libs/directives'

	export let f7route
	export let match = {}

	const id = f7route.params.id

	let statistics = []
	let lineups = []
	let timelines = []
	let channels = []

	const fetchStatistics = async () => {
		if (statistics.length) {
			return
		}
		getMatchStatistics(id).then((data) => (statistics = data.reverse()))
	}

	const fetchLineups = async () => {
		if (lineups.length) {
			return
		}
		getMatchLineup(id).then((data) => (lineups = data))
	}

	const fetchTimelines = async () => {
		if (timelines.length) {
			return
		}
		getMatchTimeline(id).then((data) => (timelines = data.reverse()))
	}

	const fetchChannels = async () => {
		if (channels.length) {
			return
		}
		getMatchTV(id).then((data) => (channels = data.reverse()))
	}
</script>

<Page name="match">
	<Header title={match.strEvent} subtitle={match.strLeague} logo={match.strSquare} />
	<Toolbar bottom tabbar icons>
		<Link tabLink="#tab-match-result" text="Result" iconF7="alarm" tabLinkActive />
		<Link tabLink="#tab-match-statistic" text="Statistics" iconF7="sportscourt" />
		<Link tabLink="#tab-match-lineup" text="Lineup" iconF7="person_2" />
		<Link tabLink="#tab-match-timeline" text="Timeline" iconF7="flag" />
		<Link tabLink="#tab-match-tv" text="TV" iconF7="tv" />
	</Toolbar>
	<Tabs animated>
		<Tab id="tab-match-result" class="py-0 page-content" tabActive>
			<List mediaList>
				<Match {match} />
			</List>
		</Tab>
		<Tab id="tab-match-statistic" class="py-0 page-content" on:tabShow={fetchStatistics}>
			<Card class="data-table">
				<table>
					<thead>
						<tr>
							<th class="text-right">{match.strHomeTeam}</th>
							<th class="text-center">VS</th>
							<th class="text-left">{match.strAwayTeam}</th>
						</tr>
					</thead>
					<tbody>
						{#if match.intHomeScore && match.intAwayScore}
							<tr>
								<td class="text-right">{match.intHomeScore || ''}</td>
								<td class="text-center">Score</td>
								<td class="text-left">{match.intAwayScore || ''}</td>
							</tr>
						{/if}
						{#each statistics as statistic}
							<tr>
								<td class="text-right">
									{statistic.intHome}
								</td>
								<td class="text-center">{statistic.strStat}</td>
								<td class="text-left">
									{statistic.intAway}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Card>
		</Tab>
		<Tab id="tab-match-lineup" class="py-0 page-content" on:tabShow={fetchLineups}>
			<List mediaList>
				{#each lineups as player}
					<Player {player} />
				{/each}
			</List>
		</Tab>
		<Tab id="tab-match-timeline" class="py-0 page-content" on:tabShow={fetchTimelines}>
			<div class="timeline">
				{#each timelines as timeline}
					<div class="timeline-item">
						<div class="timeline-item-date">{timeline.intTime}</div>
						<div class="timeline-item-divider" />
						<div class="timeline-item-content card no-safe-areas">
							<div class="card-header">{timeline.strTimeline}</div>
							<div class="card-content card-content-padding">
								{timeline.strPlayer} : {timeline.strTimelineDetail}
							</div>
							<div class="card-footer">{timeline.strAssist}</div>
						</div>
					</div>
				{/each}
			</div>
		</Tab>
		<Tab id="tab-match-tv" class="py-0 page-content" on:tabShow={fetchChannels}>
			<List mediaList>
				{#each channels as channel}
					<ListItem
						class="hover:bg-blue-500"
						title={channel.strChannel}
						footer={channel.strCountry}
					>
						<img
							use:fallback
							slot="media"
							alt={channel.strChannel}
							src={channel.strLogo}
							class="w-12"
						/>
					</ListItem>
				{/each}
			</List>
		</Tab>
	</Tabs>
</Page>
