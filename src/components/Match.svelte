<script>
	import { Link, ListItem } from 'framework7-svelte'
	import dayjs from 'dayjs'
	import { fallback } from '@/libs/directives'

	export let match = {}

	$: matchTimestamp = match?.strTimestamp || match.updated
	$: matchDateTime = matchTimestamp ? dayjs(matchTimestamp).format('DD/MM/YYYY HH:mm') : ''
	$: matchId = match.idEvent || match.idLiveScore
</script>

<ListItem link={`/match/${matchId}`} class="hover:bg-blue-500" noChevron>
	<div slot="title" class="fh-full">
		<Link href={`team/${match.idHomeTeam}`} class="flex items-center justify-start">
			<img use:fallback src={match.strHomeTeamBadge} class="w-4" alt={match.strHomeTeam} />
			<span class="ml-1">{match.strHomeTeam}</span>
		</Link>
		<Link href={`team/${match.idAwayTeam}`} class="flex items-center justify-start">
			<img use:fallback src={match.strAwayTeamBadge} class="w-4" alt={match.strAwayTeam} />
			<span class="ml-1">{match.strAwayTeam}</span>
		</Link>
	</div>
	<div slot="after" class="flex items-center px-4">
		{matchDateTime}
	</div>
	<div slot="after-end">
		{#if match.intHomeScore && match.intAwayScore}
			<div>{match.intHomeScore}</div>
			<div>{match.intAwayScore}</div>
		{/if}
	</div>
</ListItem>
