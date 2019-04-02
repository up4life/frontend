import React, { Fragment, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { withRouter } from 'next/router';
import NProgress from 'nprogress';
import classNames from 'classnames';
import { useApolloClient, useQuery } from 'react-apollo-hooks';
import { useMutation } from '../Mutations/useMutation';
import JoyRide from 'react-joyride';

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Drawer, IconButton, ClickAwayListener, Fab } from '@material-ui/core';
import { Menu, ChevronLeft, ChatBubbleRounded } from '@material-ui/icons';
//Q&M
import { ALL_EVENTS_QUERY } from '../Queries/AllEvents';
import User from '../Queries/User';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
//components
import Filters from './Filters';
import Event from './Event';
import LocationSearch from './LocationSearch';

import UserModal from '../UserModal/';
import Primary from '../../styledComponents/Typography/Primary';
import Footer from '../Footer';
import ChatBubble from './ChatBubble';
//styled components
import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';
import Button from '../../styledComponents/CustomButtons/Button';
//styles
import Gradients from '../linearGradients';
import styles from '../../static/jss/Home/eventsStyles';
import steps from './Intro';

const Events = props => {
	let { classes, router, href, user, getEvents } = props;

	const client = useApolloClient();
	const [ drawer, setDrawer ] = useState(false);
	const [ skip, setSkip ] = useState(true);
	const [ page, setPage ] = useState(0);
	const firstUpdate = useRef(true);
	//const [ events, setEvents ] = useState(getEvents.getEvents.events);
	const [ location, setLocation ] = useState(user.location);
	const [ filters, setFilters ] = useState({
		categories: getEvents.getEvents.categories,
		genres: getEvents.getEvents.genres,
		dates: getEvents.getEvents.dates,
	});

	const { data } = useQuery(ALL_EVENTS_QUERY, { variables: { page, location, ...filters } });

	let events = data.getEvents.events;
	// async function fetchEvents(more) {
	// 	const variables = { page, location, ...filters };

	// 	let { data, error, loading } = await client.query({
	// 		query: ALL_EVENTS_QUERY,
	// 		variables,
	// 		fetchPolicy: 'cache-only',
	// 	});

	// 	if (more) {
	// 		let { getEvents } = client.readQuery({
	// 			query: ALL_EVENTS_QUERY,
	// 			variables: {
	// 				...variables,
	// 				page: page - 1,
	// 			},
	// 		});
	// 		console.log(getEvents);
	// 		let uniqueEvents = getEvents.events.filter(
	// 			x => !events.some(y => x.tmID === y.tmID || y.id === x.id)
	// 		);
	// 		let newEvents = [ ...getEvents.events, ...uniqueEvents ];
	// 		client.writeQuery({
	// 			query: ALL_EVENTS_QUERY,
	// 			variables,
	// 			data: {
	// 				getEvents: {
	// 					...getEvents,
	// 					events: newEvents,
	// 				},
	// 			},
	// 		});
	// 		return newEvents;
	// 	}

	// 	return data;
	// }

	const [ updateUser ] = useMutation(UPDATE_USER_MUTATION, {
		onCompleted: () => NProgress.done(),
		onError: () => NProgress.done(),
	});

	// useEffect(
	// 	() => {
	// 		if (firstUpdate.current) {
	// 			firstUpdate.current = false;
	// 			return;
	// 		}
	// 		NProgress.start();
	// 		setSkip(false);
	// 		fetchEvents().then(({ getEvents }) => setEvents(getEvents.events)).catch(e => console.log(e));
	// 	},
	// 	[ filters, location ]
	// );

	// useEffect(
	// 	() => {
	// 		if (page > 0) {
	// 			NProgress.start();
	// 			setSkip(false);

	// 			fetchEvents(true)
	// 				.then(newEvents => {
	// 					console.log(newEvents);
	// 					setEvents(newEvents);
	// 					NProgress.done();
	// 				})
	// 				.catch(e => console.log(e));
	// 		}
	// 	},
	// 	[ page ]
	// );

	const joyrideStyles = {
		backgroundColor: '#252525',
		textColor: '#fafafa',
		primaryColor: '#f1001f',
	};

	return (
		<User>
			{({ data: { currentUser } }) => (
				<Fragment>
					<div className={classes.background}>
						<JoyRide
							styles={{ options: joyrideStyles }}
							run={!currentUser.events.length}
							steps={steps}
							continuous
							showSkipButton
							disableOverlayClose
						/>
						{router.query.user && <UserModal user={router.query.user} currentUser={currentUser} />}
						<Gradients />
						{/* {newUser && <NewUser />} */}
						<div id='body' className={classes.container}>
							<Fragment>
								<IconButton
									aria-label='Open drawer'
									id='filters'
									onClick={() => {
										setDrawer(!drawer);
										console.log(drawer);
									}}
									className={classNames(classes.menuButton, classes.transparentButton)}
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
											<p style={{ margin: 0 }}>Showing events near {location}.</p>

											{currentUser && currentUser.location !== location ? (
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
													{events.filter((e, i) => i % 2 === 0).map((event, i) => (
														<Event
															first={i === 0}
															event={event}
															key={event.id}
															//refetch={refetch}
															user={currentUser}
														/>
													))}
												</GridItem>

												<GridItem sm={12} md={6} lg={6}>
													{events.filter((e, i) => i % 2 !== 0).map(event => (
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
							<ChatBubble />
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
