import axios from 'axios'

axios.defaults.baseURL = '/api'

const request = (options) =>
	axios
		.request(options)
		.then(({ data }) => [null, data])
		.catch((e) => [e.message, null])

const getList = async (config, key) => {
	const [error, data] = await request(config)

	if (error) {
		return []
	}

	return Array.isArray(data[key]) ? data[key] : []
}

const getItem = async (config, key) => {
	const [error, data] = await request(config)

	if (error) {
		return {}
	}

	return Array.isArray(data[key]) ? data[key][0] : {}
}

export const getLeagueInfo = async (id) =>
	getItem({ url: '/lookupleague.php', params: { id } }, 'leagues')

export const getLeagueSeasons = async (id) =>
	getList({ url: '/search_all_seasons.php', params: { id } }, 'seasons')

export const getLeagueLastMatches = async (id) =>
	getList({ url: '/eventspastleague.php', params: { id } }, 'events')

export const getLeagueNextMatches = async (id) =>
	getList({ url: '/eventsnextleague.php', params: { id } }, 'events')

export const getLeagueTeams = async (id) =>
	getList({ url: '/lookup_all_teams.php', params: { id } }, 'teams')

export const getLeagueTable = async (id, season) =>
	getList(
		{
			url: '/lookuptable.php',
			params: {
				l: id,
				s: season
			}
		},
		'table'
	)

export const getSeasonMatches = async (id, season) =>
	getList(
		{
			url: '/eventsseason.php',
			params: { id, s: season }
		},
		'events'
	)

export const getRoundMatches = async (id, season, round) =>
	getList(
		{
			url: '/eventsround.php',
			params: { id, s: season, r: round }
		},
		'events'
	)

export const getTeamInfo = async (id) =>
	getItem(
		{
			url: '/lookupteam.php',
			params: { id }
		},
		'teams'
	)

export const getTeamLastMatches = async (id) =>
	getList(
		{
			url: '/eventslast.php',
			params: { id }
		},
		'results'
	)

export const getTeamNextMatches = async (id) =>
	getList(
		{
			url: '/eventsnext.php',
			params: { id }
		},
		'events'
	)

export const getTeamPlayers = async (id) =>
	getList(
		{
			url: '/lookup_all_players.php',
			params: { id }
		},
		'player'
	)

export const getTeamEquipments = async (id) =>
	getList(
		{
			url: '/lookupequipment.php',
			params: { id }
		},
		'equipment'
	)

export const getPlayerInfo = async (id) =>
	getItem(
		{
			url: '/lookupplayer.php',
			params: { id }
		},
		'players'
	)

export const getPlayerHonours = async (id) =>
	getList(
		{
			url: '/lookuphonours.php',
			params: { id }
		},
		'honours'
	)

export const getPlayerMilestones = async (id) =>
	getList(
		{
			url: '/lookupmilestones.php',
			params: { id }
		},
		'milestones'
	)

export const getPlayerFormerTeams = async (id) =>
	getList(
		{
			url: '/lookupformerteams.php',
			params: { id }
		},
		'formerteams'
	)

export const getPlayerContracts = async (id) =>
	getList(
		{
			url: '/lookupcontracts.php',
			params: { id }
		},
		'contracts'
	)

export const getMatchInfo = async (id) =>
	getItem(
		{
			url: '/lookupevent.php',
			params: { id }
		},
		'events'
	)

export const getMatchStatistics = async (id) =>
	getList(
		{
			url: '/lookupeventstats.php',
			params: { id }
		},
		'eventstats'
	)

export const getMatchLineup = async (id) =>
	getList(
		{
			url: '/lookuplineup.php',
			params: { id }
		},
		'lineup'
	)

export const getMatchTimeline = async (id) =>
	getList(
		{
			url: '/lookuptimeline.php',
			params: { id }
		},
		'timeline'
	)

export const getMatchResults = async (id) =>
	getList(
		{
			url: '/eventresults.php',
			params: { id }
		},
		'results'
	)

export const getMatchTV = async (id) =>
	getList(
		{
			url: '/lookuptv.php',
			params: { id }
		},
		'tvevent'
	)

export const getCountries = async () => getList({ url: '/all_countries.php' }, 'countries')
export const getSports = async () => getList({ url: '/all_sports.php' }, 'sports')
export const getLeagues = async () => getList({ url: '/all_leagues.php' }, 'leagues')

export const getLeaguesByCondition = async (country, sport) =>
	getList(
		{
			url: '/search_all_leagues.php',
			params: { c: country, s: sport }
		},
		'countries'
	)

export const getMatchesByCondition = async (date, sport, league) =>
	getList(
		{
			url: '/eventsday.php',
			params: { d: date, s: sport, l: league }
		},
		'events'
	)

export const getTVMatchesByCondition = async (date, country, sport) =>
	getList(
		{
			url: '/eventstv.php',
			params: { d: date, a: country, s: sport }
		},
		'tvevents'
	)

export const getLiveMatches = async (sport, league) =>
	getList(
		{
			url: '/livescore.php',
			params: { s: sport, l: league }
		},
		'events'
	)

export const getMatchHighlights = async (date, sport, league) =>
	getList(
		{
			url: '/eventshighlights.php',
			params: { d: date, s: sport, i: league }
		},
		'tvhighlights'
	)

export const searchTeams = async (team) =>
	getList(
		{
			url: '/searchteams.php',
			params: { t: team }
		},
		'teams'
	)

export const searchPlayers = async (player) =>
	getList(
		{
			url: '/searchplayers.php',
			params: { p: player }
		},
		'player'
	)

export const searchMatches = async (match) =>
	getList(
		{
			url: '/searchevents.php',
			params: { e: match }
		},
		'event'
	)
