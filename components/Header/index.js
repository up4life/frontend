import React, { useEffect, useState, Fragment, useRef } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import NProgress from 'nprogress';
import moment from 'moment';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { withRouter } from 'next/router';

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

const Nav = ({ classes, color, router, href, user }) => {
	const audioRef = useRef(null);
	const subscription = useSubscription(MY_MESSAGE_SUBSCRIPTION, {
		variables: { id: user.id },
		onSubscriptionData: async ({ client, subscriptionData }) => {
			if (subscriptionData.data.myMessages.node.from.id !== user.id) {
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
								<div>
									<audio ref={audioRef} src='/static/quiet-knock.mp3' />
								</div>
								<ListItem className={classes.listItem}>
									<Button
										className={classes.navLink}
										onClick={e => {
											e.preventDefault();
											Router.push('/home');
										}}
										color='transparent'
									>
										{/* <Explore /> Discover */}
										<Home style={{ height: '30px', width: '30px' }} />
									</Button>
								</ListItem>
								<ListItem className={classes.listItem}>
									<Button
										className={classes.navLink}
										onClick={e => {
											e.preventDefault();
											Router.push('/profile');
										}}
										color='transparent'
									>
										<AccountCircle style={{ height: '30px', width: '30px' }} />
									</Button>
								</ListItem>

								<ListItem style={{ bottom: '5px' }} className={classes.listItem}>
									<CustomDropdown
										className={classes.messageDropdown}
										dropPlacement='bottom-end'
										caret={false}
										messages
										// hoverColor='dark'
										dropdownHeader={
											newMessages.length ? (
												newMessages.length + ' new messages!'
											) : (
												'no new messages.'
											)
										}
										buttonText={
											<Badge badgeContent={newMessages.length} color='error'>
												<Mail
													style={{
														height: '30px',
														width: '30px',
														marginLeft: '10px',
														position: 'relative',
														top: 2,
													}}
												/>
											</Badge>
										}
										buttonProps={{
											className: classes.navLink + ' ' + classes.imageDropdownButton,
											color: 'transparent',
										}}
										dropdownList={
											chats ? (
												chats.map(chat => {
													return (
														<Fragment>
															{/* <Divider className={classes.dropdownDividerItem} /> */}
															<div
																onClick={() =>
																	Router.push(
																		{
																			pathname: router.pathname === '/' ? '/home' : router.pathname,
																			query: {
																				slug: router.query.slug,
																				user: chat.fromId,
																			},
																		},
																		router.query.slug
																			? `${router.pathname}/${router.query
																					.slug}/user/${chat.fromId}`
																			: router.pathname === '/'
																				? `/user/${chat.fromId}`
																				: `${router.pathname}/user/${chat.fromId}`,
																		{ shallow: true },
																		{ scroll: false }
																	)}
																style={{
																	display: 'flex',
																	padding: '5px',
																	borderRight: newMessages.some(msg => msg.chat.id === chat.id)
																		? '4px solid #ff101f'
																		: 'none',
																	borderTopRightRadius: '3px',
																	borderBottomRightRadius: '3px',
																}}
															>
																<img
																	src={chat.img}
																	style={{
																		width: '40px',
																		height: '40px',
																		borderRadius: '6px',
																		marginRight: '15px',
																		boxShadow:
																			'0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
																	}}
																/>
																<div style={{ flexGrow: 1 }}>
																	<div
																		style={{
																			display: 'flex',
																			justifyContent: 'space-between',
																		}}
																	>
																		<p className={classes.title}>{chat.from}</p>
																		<small>
																			{moment(chat.time).fromNow()}
																			<div className={chat.newMsgs ? classes.newIndicator : null}>
																				{chat.newMsgs ? chat.newMsgs + ' new' : null}
																			</div>
																		</small>
																	</div>
																	<div
																		style={{
																			maxWidth: '300px',
																			overflow: 'hidden',
																			textOverflow: 'ellipsis',
																		}}
																	>
																		{chat.text}
																	</div>
																</div>
															</div>
														</Fragment>
													);
												})
											) : (
												[]
											)
										}
									/>
								</ListItem>
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
											<ListItem style={{ marginLeft: '10px' }} className={classes.listItem}>
												<CustomDropdown
													left
													caret={false}
													hoverColor='dark'
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
													dropdownList={[ 'Sign out' ]}
													onClick={e => {
														signout();
														client.clearStore();
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

export default withRouter(withStyles(navbarsStyle)(Nav));
