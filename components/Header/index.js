import React, { useRef } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import NProgress from 'nprogress';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { withSnackbar } from 'notistack';
import { withRouter } from 'next/router';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { List, ListItem } from '@material-ui/core';
import navbarsStyle from '../../static/jss/material-kit-pro-react/views/componentsSections/navbarsStyle.jsx';
//Q&M

import User from '../Queries/User';
// styled components
import Button from '../../styledComponents/CustomButtons/Button.jsx';
import Header from '../../styledComponents/Header/Header.jsx';

import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';

Router.onRouteChangeComplete = () => {
	NProgress.done(true);
};

const SIGNOUT_MUTATION = gql`
	mutation SIGNOUT_MUTATION {
		signout {
			message
		}
	}
`;

const MY_CHAT_SUBSCRIPTION = gql`
	subscription($id: String!) {
		myChat(id: $id) {
			mutation
			node {
				id
				users {
					id
					firstName
					img {
						id
						img_url
						default
					}
				}
				typing {
					id
					firstName
				}
				messages {
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
	}
`;

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

const Nav = ({ classes, color, router, enqueueSnackbar, user }) => {
	const audioRef = useRef(null);
	useSubscription(MY_CHAT_SUBSCRIPTION, {
		variables: { id: user.id }
	})
	const subscription = useSubscription(MY_MESSAGE_SUBSCRIPTION, {
		variables: { id: user.id },
		onSubscriptionData: async ({ client, subscriptionData }) => {
			//console.log(subscriptionData);
			let from = subscriptionData.data.myMessages.node.from;
			if (from.id !== user.id) {
				enqueueSnackbar(`New message from ${from.firstName}`, {
					preventDuplicate: true,
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
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
	return (
		<User>
			{({ data: { currentUser } }) => {
				return (
					<div>
						<audio ref={audioRef} src='/static/quiet-knock.mp3' />

						<Header
							color={color}
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
									<Mutation mutation={SIGNOUT_MUTATION} onCompleted={() => Router.push('/joinus')}>
										{(signout, { client }) => {
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
																src={
																	currentUser && currentUser.img.find(img => img.default).img_url
																}
																className={classes.img + ' ' + classes.imageProfile}
																alt='profile'
															/>
														}
														buttonProps={{
															className: classes.navLink + ' ' + classes.imageDropdownButton,
															color: 'transparent',
														}}
														dropdownList={[ 'Dashboard', 'Sign out' ]}
														onClick={e => {
															if (e === 'Sign out') {
																signout();
																client.clearStore();
															}
															if (e === 'Dashboard') {
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
					</div>
				);
			}}
		</User>
	);
};

export default withSnackbar(withRouter(withStyles(navbarsStyle)(Nav)));
