<script>
	import { BlockTitle, Link, List, ListItem, Page, Tab, Tabs, Toolbar } from 'framework7-svelte'
	import { onMount } from 'svelte'
	import Header from '@/components/Header.svelte'
	import Match from '@/components/Match.svelte'
	import Player from '@/components/Player.svelte'
	import {
		getTeamEquipments,
		getTeamLastMatches,
		getTeamNextMatches,
		getTeamPlayers
	} from '@/libs/api'
	import { fallback } from '@/libs/directives'

	export let f7route
	export let team = {}

	const id = f7route.params.id

	let lastMatches = []
	let nextMatches = []
	let players = []
	let equipments = []

	const getTeamData = async () => {
		getTeamLastMatches(id).then((data) => (lastMatches = data))
		getTeamNextMatches(id).then((data) => (nextMatches = data))
	}

	const fetchPlayers = () => {
		if (players.length) {
			return
		}
		getTeamPlayers(id).then((data) => (players = data))
	}

	const fetchEquipments = () => {
		if (equipments.length) {
			return
		}
		getTeamEquipments(id).then((data) => (equipments = data.reverse()))
	}

	onMount(() => {
		getTeamData()
	})
</script>

<Page name="team">
	<Header title={team.strTeam} subtitle={team.strStadium} logo={team.strTeamBadge} />
	<Toolbar bottom tabbar icons>
		<Link tabLink="#tab-team-match" text="Matches" iconF7="alarm" tabLinkActive />
		<Link tabLink="#tab-team-player" text="Players" iconF7="person" />
		<Link tabLink="#tab-team-equipment" text="Equipments" iconF7="shield" />
	</Toolbar>
	<Tabs animated>
		<Tab id="tab-team-match" class="py-0 page-content" tabActive>
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
		<Tab id="tab-team-player" class="py-0 page-content" on:tabShow={fetchPlayers}>
			<List dividersIos outlineIos strongIos mediumInset>
				{#each players as player}
					<Player {player} />
				{/each}
			</List>
		</Tab>
		<Tab id="tab-team-equipment" class="py-0 page-content" on:tabShow={fetchEquipments}>
			<List dividersIos outlineIos strongIos mediumInset>
				{#each equipments as equipment}
					<ListItem
						class="hover:bg-blue-500"
						title={equipment.strUsername}
						footer={equipment.strSeason}
						after={equipment.strType}
					>
						<img
							use:fallback
							slot="media"
							alt={equipment.strUsername}
							src={equipment.strEquipment}
							class="w-12"
						/>
					</ListItem>
				{/each}
			</List>
		</Tab>
	</Tabs>
</Page>
