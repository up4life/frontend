import React, { useEffect, useState, Fragment, useRef } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { SEND_MESSAGE_MUTATION } from '../Mutations/sendMessage';
import { useMutation } from '../Mutations/useMutation';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import NProgress from 'nprogress';
import { Drawer, IconButton, ClickAwayListener, Badge, Fab } from '@material-ui/core';
import { Menu, ChevronLeft, ChatBubbleRounded } from '@material-ui/icons';
import styles from '../../static/jss/Home/eventsStyles';
import User, { CURRENT_USER_QUERY } from '../Queries/User';
import { ALL_CHATS_QUERY } from '../Queries/AllChats';
import date from '../../utils/formatDate';
import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';
import Button from '../../styledComponents/CustomButtons/Button.jsx';
import withStyles from '@material-ui/core/styles/withStyles';

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

const Chat = ({ classes, enqueueSnackbar, user }) => {
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

	let chats = data.getUserChats ? formattedChats(data.getUserChats, user) : [];
	let newMessages = data.getUserChats ? newMessageCount(data.getUserChats, user) : [];
	return (
		<CustomDropdown
			left
			dropUp
			caret={false}
			messages
			dropPlacement='top-end'
			//className={classes.fabButton}
			buttonText={
				<Badge
					badgeContent={newMessages.length}
					classes={{ badge: `${classes.chatBadge} ` }}
					color='error'
				>
					<Fab color='secondary' aria-label='Add' component='div'>
						<ChatBubbleRounded className={classes.chatIcon} />
					</Fab>
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
												? `${router.pathname}/${router.query.slug}/user/${chat.fromId}`
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
											boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
										}}
									/>
									<div style={{ flexGrow: 1 }}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<div>
												<p className={classes.title}>{chat.from}</p>
												<div
													style={{
														maxWidth: '250px',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{chat.text}
												</div>
											</div>
											<small>
												{date(chat.time)}
												<div className={chat.newMsgs ? classes.newIndicator : null}>
													{chat.newMsgs ? chat.newMsgs + ' new' : null}
												</div>
											</small>
										</div>
									</div>
								</div>
								<div>
									{chat.newMsgs ? (
										<input
											onClick={e => e.stopPropagation()}
											value={message}
											onChange={e => setMessage(e.target.value)}
											onKeyDown={e => {
												if (e.keyCode === 13) {
													NProgress.start();
													console.log(message);
													sendMessage({
														variables: { id: chat.fromId, message },
													});
												}
											}}
											className={classes.respondInput}
											placeholder={`Respond to ${chat.from}...`}
										/>
									) : null}
								</div>
							</Fragment>
						);
					})
				) : (
					[]
				)
			}
		/>
	);
};

export default withStyles(styles)(Chat);
