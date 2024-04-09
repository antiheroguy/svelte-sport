<script>
	import { ListItem } from 'framework7-svelte'
	import { fallback } from '@/libs/directives'

	export let player

	$: playerNumber = player.strNumber || player.intSquadNumber
</script>

<ListItem
	class="hover:bg-blue-500"
	link={`/player/${player.idPlayer}`}
	title={player.strPlayer}
	footer={player.strPosition}
	after={playerNumber}
	noChevron
>
	<img use:fallback slot="media" alt={player.strPlayer} src={player.strCutout} class="w-12" />
</ListItem>
