import React, { useEffect, useState, Fragment, useRef } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import NProgress from 'nprogress';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { withRouter } from 'next/router';
import { useMutation } from '../Mutations/useMutation';
import { SEND_MESSAGE_MUTATION } from '../Mutations/sendMessage';

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { List, ListItem, Badge, Divider } from '@material-ui/core';
import { AccountCircle, Explore, Mail, LocationCityOutlined, Home } from '@material-ui/icons';
import navbarsStyle from '../../static/jss/material-kit-pro-react/views/componentsSections/navbarsStyle.jsx';
//Q&M

import User, { CURRENT_USER_QUERY } from '../Queries/User';
import { ALL_CHATS_QUERY } from '../Queries/AllChats';
// styled components
// import GridContainer from '../../styledComponents/Grid/GridContainer.jsx';
// import GridItem from '../../styledComponents/Grid/GridItem.jsx';
import Header from '../../styledComponents/Header/Header.jsx';
// import CustomInput from '../../styledComponents/CustomInput/CustomInput.jsx';
import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';
import Button from '../../styledComponents/CustomButtons/Button.jsx';
//assets
import date from '../../utils/formatDate';
//import notification from '';
import profileStandIn from '../../static/img/placeholder.jpg';

Router.onRouteChangeComplete = () => {
	NProgress.done(true);
};
const MY_MESSAGE_SUBSCRIPTION = gql`
	subscription($id: String!) {
		myMessages(id: $id) {
			mutation
			node {
				chat {
					id
				}
				id
				text
				seen
				createdAt
				from {
					id
					firstName
					img {
						id
						img_url
						default
					}
				}
				updatedAt
			}
		}
	}
`;

const SIGNOUT_MUTATION = gql`
	mutation SIGNOUT_MUTATION {
		signout {
			message
		}
	}
`;

const Nav = ({ classes, color, router, href, user, enqueueSnackbar }) => {
	const audioRef = useRef(null);
	const [ message, setMessage ] = useState(undefined);
	const [ sendMessage ] = useMutation(SEND_MESSAGE_MUTATION, {
		onCompleted: () => {
			NProgress.done();
			setMessage(undefined);
		},
		onError: e => {
			NProgress.done();
			console.log(e);
		},
	});
	const subscription = useSubscription(MY_MESSAGE_SUBSCRIPTION, {
		variables: { id: user.id },
		onSubscriptionData: async ({ client, subscriptionData }) => {
			let from = subscriptionData.data.myMessages.node.from;
			if (from.id !== user.id) {
				enqueueSnackbar(`New message from ${from.firstName}`, {
					preventDuplicate: true,
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'right',
					},
					action: (
						<Button
							simple
							onClick={() => {
								Router.push(
									{
										pathname: router.pathname === '/' ? '/home' : router.pathname,
										query: {
											slug: router.query.slug,
											user: from.id,
										},
									},
									router.query.slug
										? `${router.pathname}/${router.query.slug}/user/${from.id}`
										: router.pathname === '/'
											? `/user/${from.id}`
											: `${router.pathname}/user/${from.id}`,
									{ shallow: true },
									{ scroll: false }
								);
							}}
							size='small'
						>
							{'View'}
						</Button>
					),
				});
				try {
					await audioRef.current.play();
				} catch (e) {
					console.log(e.message);
				}
			}
		},
	});

	const { data, loading, refetch } = useQuery(ALL_CHATS_QUERY, {
		pollInterval: 600,
	});
	const formattedChats = (newMessages, user) => {
		return newMessages
			.filter(msg => msg.messages)
			.map(chatObj => {
				let len = chatObj.messages.length - 1;
				const { messages, users } = chatObj;
				let [ usr ] = users.filter(usr => usr.id !== user.id);
				let newMsgs = messages.filter(msg => !msg.seen && msg.from.id !== user.id);
				let img = usr && usr.img.length ? usr.img.find(img => img.default).img_url : profileStandIn;
				return {
					id: chatObj.id,
					from: usr && usr.firstName,
					fromId: usr && usr.id,
					newMsgs: newMsgs.length,
					text: messages[len] ? messages[len].text : null,
					img: img,
					time: messages[len] ? messages[len].createdAt : null,
				};
			})
			.sort((a, b) => {
				let dateA = new Date(a.time);
				let dateB = new Date(b.time);
				return dateB - dateA;
			});
	};

	const newMessageCount = (newMessages, user) => {
		return newMessages.reduce((count, mess) => {
			let newcount = mess.messages.filter(msg => !msg.seen && msg.from.id !== user.id);

			return [ ...count, ...newcount ];
		}, []);
	};

	// let profileImage =
	// 	currentUser && currentUser.img.length
	// 		?
	// 		: profileStandIn;
	return (
		<User>
			{({ data: { currentUser } }) => {
				let chats = data.getUserChats ? formattedChats(data.getUserChats, currentUser) : [];
				let newMessages = data.getUserChats ? newMessageCount(data.getUserChats, currentUser) : [];

				return (
					<Header
						color={color}
						//brand={Logo}
						fixed={color === 'transparent'}
						changeColorOnScroll={
							color === 'transparent' ? (
								{
									height: 300,
									color: 'warning',
								}
							) : null
						}
						links={
							<List className={classes.list + ' ' + classes.mlAuto}>
								{/* <ListItem className={classes.listItem}>
									<Button
										className={classes.navLink}
										onClick={e => {
											e.preventDefault();
											Router.push('/home');
										}}
										color='transparent'
									>
										{/* <Explore /> Discover */}
								{/* <Home style={{ height: '30px', width: '30px' }} />
									</Button>
								</ListItem> */}{' '}
								<Mutation
									mutation={SIGNOUT_MUTATION}
									// refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
									// awaitRefetchQueries
									onCompleted={() => Router.push('/joinus')}
								>
									{(signout, { called, client }) => {
										{
											/* if (called) Router.push('/joinus'); */
										}
										return (
											<ListItem
												id='button'
												style={{ marginLeft: '10px' }}
												className={classes.listItem}
											>
												<CustomDropdown
													left
													caret={false}
													dropdownHeader={currentUser && currentUser.firstName}
													buttonText={
														<img
															src={currentUser && currentUser.img.find(img => img.default).img_url}
															className={classes.img + ' ' + classes.imageProfile}
															alt='profile'
														/>
													}
													buttonProps={{
														className: classes.navLink + ' ' + classes.imageDropdownButton,
														color: 'transparent',
													}}
													dropdownList={[ 'Profile', 'Sign out' ]}
													onClick={e => {
														if (e === 'Sign out') {
															signout();
															client.clearStore();
														}
														if (e === 'Profile') {
															Router.push('/profile');
														}
													}}
												/>
											</ListItem>
										);
									}}
								</Mutation>
							</List>
						}
					/>
				);
			}}
		</User>
	);
};

export default withSnackbar(withRouter(withStyles(navbarsStyle)(Nav)));
