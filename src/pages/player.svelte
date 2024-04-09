<script>
	import { Page, List, ListItem, Toolbar, Link, Tabs, Card, Tab } from 'framework7-svelte'
	import dayjs from 'dayjs'
	import groupBy from 'lodash/groupBy'
	import Header from '@/components/Header.svelte'
	import {
		getPlayerContracts,
		getPlayerFormerTeams,
		getPlayerHonours,
		getPlayerMilestones
	} from '@/libs/api'
	import { fallback } from '@/libs/directives'

	export let f7route
	export let player = {}

	const id = f7route.params.id

	let honours = []
	let teams = []
	let contracts = []
	let milestones = []

	const fetchHonours = async () => {
		if (honours.length) {
			return
		}
		getPlayerHonours(id).then((data) => {
			honours = data.reverse()
		})
	}

	const fetchTeams = async () => {
		if (teams.length) {
			return
		}
		getPlayerFormerTeams(id).then((data) => {
			teams = data.reverse()
		})
	}

	const fetchContracts = async () => {
		if (contracts.length) {
			return
		}
		getPlayerContracts(id).then((data) => {
			contracts = data.reverse()
		})
	}

	const fetchMilestones = async () => {
		if (milestones.length) {
			return
		}
		getPlayerMilestones(id).then((data) => {
			milestones = Object.entries(
				groupBy(
					data
						.map((item) => {
							const date = dayjs(item.dateMilestone)
							item.yearMilestone = date.format('YYYY')
							item.monthMilestone = date.format('MM')
							item.dayMilestone = date.format('DD')
							return item
						})
						.reverse(),
					'yearMilestone'
				)
			)
				.map(([yearMilestone, items]) => ({
					milestones: items,
					yearMilestone
				}))
				.reverse()
		})
	}
</script>

<Page name="player">
	<Header title={player.strPlayer} subtitle={player.strTeam} logo={player.strCutout} />
	<Toolbar bottom tabbar icons>
		<Link tabLink="#tab-player-info" text="Info" iconF7="person" tabLinkActive />
		<Link tabLink="#tab-player-honour" text="Honours" iconF7="gift" />
		<Link tabLink="#tab-player-team" text="Teams" iconF7="person_3" />
		<Link tabLink="#tab-player-contract" text="Contracts" iconF7="doc_person" />
		<Link tabLink="#tab-player-milestone" text="Milestones" iconF7="flag" />
	</Toolbar>
	<Tabs animated>
		<Tab id="tab-player-info" class="py-0 page-content" tabActive>
			<Card class="data-table">
				<table>
					<thead>
						<tr>
							<th class="label-cell">Name</th>
							<th>
								{player.strPlayer}
								{#if player.strPlayerAlternate}
									({player.strPlayerAlternate})
								{/if}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="label-cell">Position</td>
							<td>{player.strPosition}</td>
						</tr>
						<tr>
							<td class="label-cell">Number</td>
							<td>{player.strNumber}</td>
						</tr>
						<tr>
							<td class="label-cell">Side</td>
							<td>{player.strSide}</td>
						</tr>
						<tr>
							<td class="label-cell">Team</td>
							<td>
								<div>
									<Link href={`/team/${player.idTeam}`}>{player.strTeam}</Link>
								</div>
								{#if player.strTeam2}
									<div>
										<Link href={`/team/${player.idTeam2}`}>{player.strTeam2}</Link>
									</div>
								{/if}
							</td>
						</tr>
						<tr>
							<td class="label-cell">Born</td>
							<td>
								{player.dateBorn}
								{#if player.strBirthLocation}
									({player.strBirthLocation})
								{/if}
							</td>
						</tr>
						<tr>
							<td class="label-cell">Nationality</td>
							<td>{player.strNationality}</td>
						</tr>
						<tr>
							<td class="label-cell">Gender</td>
							<td>{player.strGender}</td>
						</tr>
						<tr>
							<td class="label-cell">Ethnicity</td>
							<td>{player.strEthnicity}</td>
						</tr>
						<tr>
							<td class="label-cell">Height</td>
							<td>{player.strHeight}</td>
						</tr>
						<tr>
							<td class="label-cell">Weight</td>
							<td>{player.strWeight}</td>
						</tr>
						<tr>
							<td class="label-cell">Wage</td>
							<td>{player.strWage}</td>
						</tr>
						<tr>
							<td class="label-cell">Description</td>
							<td>{player.strDescriptionEN}</td>
						</tr>
						<tr>
							<td class="label-cell">Social</td>
							<td>
								{#if player.strFacebook}
									<div>
										<a target="_blank" class="link external" href={`https://${player.strFacebook}`}
											>Facebook</a
										>
									</div>
								{/if}
								{#if player.strInstagram}
									<div>
										<a target="_blank" class="link external" href={`https://${player.strInstagram}`}
											>Instagram</a
										>
									</div>
								{/if}
								{#if player.strTwitter}
									<div>
										<a target="_blank" class="link external" href={`https://${player.strTwitter}`}
											>Twitter</a
										>
									</div>
								{/if}
								{#if player.strWebsite}
									<div>
										<a target="_blank" class="link external" href={`https://${player.strWebsite}`}
											>Website</a
										>
									</div>
								{/if}
								{#if player.strYoutube}
									<div>
										<a target="_blank" class="link external" href={`https://${player.strYoutube}`}
											>Youtube</a
										>
									</div>
								{/if}
							</td>
						</tr>
						<tr>
							<td class="label-cell">Signing</td>
							<td>{player.strSigning}</td>
						</tr>
						<tr>
							<td class="label-cell">Signed</td>
							<td>{player.dateSigned}</td>
						</tr>
						<tr>
							<td class="label-cell">Kit</td>
							<td>{player.strKit}</td>
						</tr>
						<tr>
							<td class="label-cell">Agent</td>
							<td>{player.strAgent}</td>
						</tr>
						<tr>
							<td class="label-cell">College</td>
							<td>{player.strCollege}</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</Tab>
		<Tab id="tab-player-honour" class="py-0 page-content" on:tabShow={fetchHonours}>
			<List dividersIos outlineIos strongIos>
				{#each honours as honour}
					<ListItem
						class="hover:bg-blue-500"
						link={`/league/${honour.idLeague}`}
						title={honour.strHonour}
						after={honour.strSeason}
						noChevron
					>
						<Link slot="footer" href={`/team/${honour.idTeam}`}>{honour.strTeam}</Link>
					</ListItem>
				{/each}
			</List>
		</Tab>
		<Tab id="tab-player-team" class="py-0 page-content" on:tabShow={fetchTeams}>
			<List mediaList>
				{#each teams as team}
					<ListItem
						class="hover:bg-blue-500"
						link={`/team/${team.idFormerTeam}`}
						title={team.strFormerTeam}
						footer={team.strMoveType}
						after={`${team.strJoined}-${team.strDeparted}`}
						noChevron
					>
						<img
							use:fallback
							slot="media"
							alt={team.strFormerTeam}
							src={team.strTeamBadge}
							class="w-12"
						/>
					</ListItem>
				{/each}
			</List>
		</Tab>
		<Tab id="tab-player-contract" class="py-0 page-content" on:tabShow={fetchContracts}>
			<List mediaList>
				{#each contracts as contract}
					<ListItem
						class="hover:bg-blue-500"
						link={`/team/${contract.idTeam}`}
						title={contract.strTeam}
						footer={contract.strWage}
						after={`${contract.strYearStart}-${contract.strYearEnd}`}
						noChevron
					>
						<img
							use:fallback
							slot="media"
							alt={contract.strTeam}
							src={contract.strTeamBadge}
							class="w-12"
						/>
					</ListItem>
				{/each}
			</List>
		</Tab>
		<Tab id="tab-player-milestone" class="py-0 page-content" on:tabShow={fetchMilestones}>
			<div class="timeline">
				{#each milestones as { milestones: groups, yearMilestone }}
					<div class="timeline-item">
						<div class="timeline-item-date">{yearMilestone}</div>
						<div class="timeline-item-divider" />
						<div class="timeline-item-content">
							<List mediaList>
								{#each groups as milestone}
									<ListItem
										class="hover:bg-blue-500"
										title={milestone.strMilestone}
										after="{milestone.dayMilestone}-{milestone.monthMilestone}"
									>
										<img
											use:fallback
											slot="media"
											alt={milestone.strMilestone}
											src={milestone.strMilestoneLogo}
											class="w-12"
										/>
										<Link slot="footer" href={`/team/${milestone.idTeam}`}>{milestone.strTeam}</Link
										>
									</ListItem>
								{/each}
							</List>
						</div>
					</div>
				{/each}
			</div>
		</Tab>
	</Tabs>
</Page>
