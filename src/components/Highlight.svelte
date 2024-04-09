<script>
	import { ListItem } from 'framework7-svelte'
	import { fallback } from '@/libs/directives'

	export let match = {}
</script>

<ListItem
	class="hover:bg-blue-500"
	link={`/match/${match.idEvent}`}
	title={match.strEvent}
	noChevron
>
	<img use:fallback slot="media" src={match.strThumb} class="w-12" alt={match.strEvent} />
	<a target="_blank" class="link external" slot="footer" href={match.strVideo}>{match.strVideo}</a>
</ListItem>
