import HomePage from '@/pages/home.svelte'
import LeaguePage from '@/pages/league.svelte'
import MatchPage from '@/pages/match.svelte'
import NotFoundPage from '@/pages/404.svelte'
import PlayerPage from '@/pages/player.svelte'
import TeamPage from '@/pages/team.svelte'

import { getLeagueInfo, getMatchInfo, getPlayerInfo, getTeamInfo } from '@/libs/api'

var routes = [
	{
		path: '/',
		component: HomePage
	},
	{
		path: '/league/:id',
		async({ router: { app }, to: { params }, resolve }) {
			app.preloader.show()

			getLeagueInfo(params.id).then((league) => {
				app.preloader.hide()

				resolve({ component: LeaguePage }, { props: { league } })
			})
		}
	},
	{
		path: '/team/:id',
		async({ router: { app }, to: { params }, resolve }) {
			app.preloader.show()

			getTeamInfo(params.id).then((team) => {
				app.preloader.hide()

				resolve({ component: TeamPage }, { props: { team } })
			})
		}
	},
	{
		path: '/player/:id',
		async({ router: { app }, to: { params }, resolve }) {
			app.preloader.show()

			getPlayerInfo(params.id).then((player) => {
				app.preloader.hide()

				resolve({ component: PlayerPage }, { props: { player } })
			})
		}
	},
	{
		path: '/match/:id',
		async({ router: { app }, to: { params }, resolve }) {
			app.preloader.show()

			getMatchInfo(params.id).then((match) => {
				app.preloader.hide()

				resolve({ component: MatchPage }, { props: { match } })
			})
		}
	},
	{
		path: '(.*)',
		component: NotFoundPage
	}
]

export default routes
