import React, { Fragment, useEffect, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import _ from 'lodash';
import { withRouter } from 'next/router';
import NProgress from 'nprogress';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';
import { useMutation } from '../Mutations/useMutation';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Drawer, IconButton, ClickAwayListener } from '@material-ui/core';
import { Menu, ChevronLeft } from '@material-ui/icons';
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
//styled components
import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';
//styles
import backgroundImg from '../../static/img/shattered-dark.png';
import drawerbgImg from '../../static/img/dark-fish-skin.png';
import styles from '../../static/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.jsx';

const Events = ({ classes, router, href, getEvents, ...props }) => {
	const [ drawer, setDrawer ] = useState(false);
	const [ skip, setSkip ] = useState(true);
	const [ page, setPage ] = useState(0);
	const [ events, setEvents ] = useState(getEvents.data.getEvents.events);
	const [ location, setLocation ] = useState(getEvents.data.getEvents.location);
	const [ filters, setFilters ] = useState({
		categories: getEvents.data.getEvents.categories,
		genres: getEvents.data.getEvents.genres,
		dates: getEvents.data.getEvents.dates,
	});
	const variables = { page, location, ...filters };
	const { data, error, loading } = useQuery(ALL_EVENTS_QUERY, {
		variables,
		skip,
		fetchPolicy: 'network-only',
	});
	const [ updateUser ] = useMutation(UPDATE_USER_MUTATION);

	useEffect(
		() => {
			if (loading) {
				NProgress.start();
			}
			if (data && data.getEvents) {
				setEvents(data.getEvents.events);
				NProgress.done(true);
			}
		},
		[ data ],
	);

	useEffect(
		() => {
			setSkip(false);
		},
		[ filters, location ],
	);
	return (
		<User>
			{({ data: { currentUser } }) => (
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
								className={classNames(classes.menuButton, drawer && classes.hide)}
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
										<LocationSearch setLocation={val => setLocation(val)} />
										<p style={{ margin: 0 }}>Showing events near {location}.</p>
										<div
											className={classes.drawerContainer}
											style={{ backgroundImage: `url(${drawerbgImg})` }}
										>
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
									</div>
									<Filters
										filters={filters}
										setFilters={setFilters}
										user={currentUser}
									/>
								</Drawer>
							</ClickAwayListener>
							<GridContainer>
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
												{events.filter((e, i) => i % 2 === 0).map(event => (
													<Event
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
					</div>
				</div>
			)}
		</User>
	);
	// 		}}
	// 	</Composed>
	// );
};

export default withRouter(withStyles(styles, { withTheme: true })(Events));
