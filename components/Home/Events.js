import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Mutation, Query } from 'react-apollo';
import _ from 'lodash';
import { withRouter } from 'next/router';
import NProgress from 'nprogress';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';
import { useApolloClient } from 'react-apollo-hooks';
import { useMutation } from '../Mutations/useMutation';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Drawer, IconButton, ClickAwayListener } from '@material-ui/core';
import { Menu, ChevronLeft, CodeSharp } from '@material-ui/icons';
//Q&M
import { ALL_EVENTS_QUERY } from '../Queries/AllEvents';
import User, { CURRENT_USER_QUERY } from '../Queries/User';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
//components
import Filters from './Filters';
import Event from './Event';
import LocationSearch from './LocationSearch';
import NewUser from './NewUser';
import UserModal from '../UserModal/';
import Primary from '../../styledComponents/Typography/Primary';
import Footer from '../Footer';
//styled components
import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';
import Button from '../../styledComponents/CustomButtons/Button';
//styles
import backgroundImg from '../../static/img/shattered-dark.png';
import drawerbgImg from '../../static/img/dark-fish-skin.png';
import styles from '../../static/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.jsx';

const Events = props => {
	let { classes, router, href, user, getEvents } = props;

	const client = useApolloClient();
	const [ drawer, setDrawer ] = useState(false);
	const [ skip, setSkip ] = useState(true);
	const [ page, setPage ] = useState(0);
	const firstUpdate = useRef(true);
	const [ events, setEvents ] = useState(getEvents.getEvents.events);
	const [ location, setLocation ] = useState(user.location);
	const [ filters, setFilters ] = useState({
		categories: getEvents.getEvents.categories,
		genres: getEvents.getEvents.genres,
		dates: getEvents.getEvents.dates,
	});

	async function fetchEvents(more) {
		const variables = { page, location, ...filters };

		let { data, error, loading } = await client.query({
			query: ALL_EVENTS_QUERY,
			variables,
			fetchPolicy: 'no-cache',
		});

		if (more) {
			let { getEvents } = client.readQuery({
				query: ALL_EVENTS_QUERY,
				variables: {
					...variables,
					page: page - 1,
				},
			});
			console.log(getEvents);
			let uniqueEvents = getEvents.events.filter(
				x => !events.some(y => x.tmID === y.tmID || y.id === x.id),
			);
			let newEvents = [ ...getEvents.events, ...uniqueEvents ];
			client.writeQuery({
				query: ALL_EVENTS_QUERY,
				variables,
				data: {
					getEvents: {
						...getEvents,
						events: newEvents,
					},
				},
			});
			return newEvents;
		}

		return data;
	}

	const [ updateUser ] = useMutation(UPDATE_USER_MUTATION, {
		onCompleted: () => NProgress.done(),
		onError: () => NProgress.done(),
	});

	useEffect(
		() => {
			if (firstUpdate.current) {
				firstUpdate.current = false;
				return;
			}
			NProgress.start();
			setSkip(false);
			fetchEvents()
				.then(({ getEvents }) => setEvents(getEvents.events))
				.catch(e => console.log(e));
		},
		[ filters, location ],
	);

	useEffect(
		() => {
			if (page > 0) {
				NProgress.start();
				setSkip(false);

				fetchEvents(true)
					.then(newEvents => {
						console.log(newEvents);
						setEvents(newEvents);
						NProgress.done();
					})
					.catch(e => console.log(e));
			}
		},
		[ page ],
	);
	return (
		<User>
			{({ data: { currentUser } }) => (
				<Fragment>
					<div
						className={classes.background}
						style={{ backgroundImage: `url(${backgroundImg})` }}
					>
						{router.query.user && (
							<UserModal user={router.query.user} currentUser={currentUser} />
						)}
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='favoriteID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#FF8A8A' />
								<stop offset='50%' stopColor='#FF545F' />
								<stop offset='100%' stopColor='#ff101f' />
							</linearGradient>
						</svg>
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='chatID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#81d6e3' />
								<stop offset='50%' stopColor='#15C0DA' />
								<stop offset='100%' stopColor='#81d6e3' />
							</linearGradient>
						</svg>
						{/* {newUser && <NewUser />} */}
						<div className={classes.container}>
							<Fragment>
								<IconButton
									style={{
										color: 'white',
										backgroundColor: 'transparent !important',
									}}
									aria-label='Open drawer'
									onClick={() => setDrawer(true)}
									className={classNames(
										classes.menuButton,
										drawer && classes.hide,
									)}
								>
									<Menu />
								</IconButton>
								<ClickAwayListener onClickAway={() => setDrawer(false)}>
									<Drawer
										classes={{ paper: classes.metaDrawer }}
										variant='persistent'
										anchor='left'
										open={drawer}
									>
										<div className={classes.drawer}>
											<IconButton
												className={classes.transparentButton}
												onClick={() => setDrawer(false)}
											>
												<ChevronLeft />
											</IconButton>
											<LocationSearch setLocation={setLocation} />
											<p style={{ margin: 0 }}>
												Showing events near {location}.
											</p>
											<div
												className={classes.drawerContainer}
												style={{ backgroundImage: `url(${drawerbgImg})` }}
											>
												{currentUser &&
												currentUser.location !== location ? (
													<Primary>
														<b
															onClick={() => {
																NProgress.start();
																updateUser({
																	variables: {
																		location: location,
																	},
																});
															}}
															style={{
																cursor: 'pointer',
															}}
														>
															make default location?
														</b>
													</Primary>
												) : (
													<div style={{ height: '21px' }} />
												)}
											</div>
										</div>
										<Filters
											filters={filters}
											setFilters={setFilters}
											user={currentUser}
											setSkip={setSkip}
										/>
									</Drawer>
								</ClickAwayListener>
								<GridContainer style={{ marginBottom: '20px' }}>
									<GridItem sm={12} md={12} sm={12}>
										{events ? (
											<GridContainer>
												<GridItem sm={12} md={6} lg={6}>
													{/* <InfiniteScroll
														pageStart={getEvents.page_number}
														loadMore={async p => {
															console.log(p, getEvents.page_count);
															if (p < getEvents.page_total - 1) {
																page.set(page.value + 1);
															}
														}}
														hasMore={page.value < getEvents.page_total}
														threshold={400}
														loader={<div key={0} />}
													> */}
													{events
														.filter((e, i) => i % 2 === 0)
														.map((event, i) => (
															<Event
																first={i === 0}
																event={event}
																key={event.id}
																//refetch={refetch}
																user={currentUser}
															/>
														))}

													{/* {getEvents.events.map(event => (
															<Event
																event={event}
																key={event.id}
																refetch={refetch}
																user={currentUser}
																location={location}
															/>
														))} */}
													{/* </InfiniteScroll> */}
												</GridItem>

												<GridItem sm={12} md={6} lg={6}>
													{events
														.filter((e, i) => i % 2 !== 0)
														.map(event => (
															<Event
																event={event}
																key={event.id}
																//refetch={refetch}
																user={currentUser}
															/>
														))}
												</GridItem>
											</GridContainer>
										) : (
											<div />
										)}
									</GridItem>
								</GridContainer>
							</Fragment>

							<div className={classes.centerButton}>
								<Button onClick={() => setPage(page + 1)}>Load More</Button>
							</div>
						</div>
					</div>
					<Footer />
				</Fragment>
			)}
		</User>
	);
	// 		}}
	// 	</Composed>
	// );
};

export default withRouter(withStyles(styles, { withTheme: true })(Events));
