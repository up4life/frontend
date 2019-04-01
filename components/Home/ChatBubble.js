import React, { useEffect, useState, Fragment, useRef } from 'react';
import Router, { withRouter } from 'next/router';
import gql from 'graphql-tag';
import { SEND_MESSAGE_MUTATION } from '../Mutations/sendMessage';
import { useMutation } from '../Mutations/useMutation';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import NProgress from 'nprogress';
import { withSnackbar } from 'notistack';
import { Drawer, IconButton, ClickAwayListener, Badge, Fab, Tooltip } from '@material-ui/core';
import { Menu, ChevronLeft, ChatBubbleRounded } from '@material-ui/icons';
import styles from '../../static/jss/Home/eventsStyles';
import User, { CURRENT_USER_QUERY } from '../Queries/User';
import Media from '../../styledComponents/Media/Media.jsx';
import { ALL_CHATS_QUERY } from '../Queries/AllChats';
import date from '../../utils/formatDate';
import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';
import Button from '../../styledComponents/CustomButtons/Button.jsx';
import withStyles from '@material-ui/core/styles/withStyles';
import formatChats from '../../utils/formatChats';
import ChatPage from './ChatPage';

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

const Chat = ({ classes, enqueueSnackbar, router, user }) => {
	const msgRef = useRef(null);
	const audioRef = useRef(null);
	const [ chatPage, showChat ] = useState(false);
	const [ message, setMessage ] = useState(undefined);
	const [ sendMessage ] = useMutation(SEND_MESSAGE_MUTATION, {
		onCompleted: e => {
			console.log(e);
			NProgress.done();
			setMessage(undefined);
		},
		onError: e => {
			NProgress.done();
			console.log(e);
		},
	});
	console.log(message);
	useEffect(
		() => {
			if (chatPage) {
				msgRef.current.focus();
			}
		},
		[ chatPage ]
	);

	const subscription = useSubscription(MY_MESSAGE_SUBSCRIPTION, {
		variables: { id: user.id },
		onSubscriptionData: async ({ client, subscriptionData }) => {
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
	function groupByUser(messages) {
		const grouped = [];
		let fromSameUser = [ messages[0] ];
		let user = messages[0].from.id;

		for (let i = 1; i < messages.length; i++) {
			if (messages[i].from.id !== user) {
				grouped.push(fromSameUser);
				fromSameUser = [ messages[i] ];
				user = messages[i].from.id;
			} else {
				fromSameUser.push(messages[i]);
			}
		}

		grouped.push(fromSameUser);
		return grouped;
	}

	const { data, loading, refetch } = useQuery(ALL_CHATS_QUERY);

	const newMessageCount = (newMessages, user) => {
		return newMessages.reduce((count, mess) => {
			let newcount = mess.messages.filter(msg => !msg.seen && msg.from.id !== user.id);

			return [ ...count, ...newcount ];
		}, []);
	};
	let messages =
		chatPage && data.getUserChats
			? groupByUser(data.getUserChats.find(x => x.id === chatPage).messages)
			: null;
	let chats = data.getUserChats ? formatChats(data.getUserChats, user) : [];
	let newMessages = data.getUserChats ? newMessageCount(data.getUserChats, user) : [];
	let lastSeenMessage =
		chatPage && data.getUserChats
			? [ ...data.getUserChats.find(x => x.id === chatPage).messages ]
					.reverse()
					.find(x => x.from.id === user.id && x.seen)
			: null;
	let fromUser =
		chatPage && data.getUserChats
			? data.getUserChats.find(x => x.id === chatPage).users.find(x => x.id !== user.id)
			: null;

	return (
		<CustomDropdown
			left
			dropUp
			forwardRef={msgRef}
			caret={false}
			dropdownHeader={
				chatPage ? (
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h5 style={{ margin: 0 }}>
							{data.getUserChats &&
								data.getUserChats.find(x => x.id === chatPage).users.find(x => x.id !== user.id)
									.firstName}
						</h5>
						<Button
							simple
							style={{ padding: 0 }}
							onClick={e => {
								e.stopPropagation();
								showChat(false);
							}}
						>
							Back
						</Button>
					</div>
				) : (
					<Button
						simple
						style={{ padding: 0 }}
						onClick={() => {
							Router.push('/profile?slug=chats', '/profile/chat');
						}}
					>
						Go to your messages
					</Button>
				)
			}
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
				chats && !chatPage ? (
					chats.map(chat => {
						return (
							<Fragment>
								{/* <Divider className={classes.dropdownDividerItem} /> */}
								<div
									onClick={e => {
										e.stopPropagation();
										showChat(chat.id);
									}}
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
				) : chats && chatPage && messages ? (
					[
						<ChatPage
							messages={messages}
							user={user}
							fromUser={fromUser}
							lastSeenMessage={lastSeenMessage}
						/>,
						<form
							className={classes.expandedChat}
							// onSubmit={e => {
							// 	console.log('hi');
							// 	e.preventDefault();
							// 	console.log(message);
							// 	NProgress.start();
							// 	sendMessage({
							// 		variables: {
							// 			id: data.getUserChats
							// 				.find(x => x.id === chatPage)
							// 				.users.find(x => x.id !== user.id).id,
							// 			message,
							// 		},
							// 	});
							// }}
						>
							<input
								ref={msgRef}
								className={classes.textareaAutosize}
								onClick={e => e.stopPropagation()}
								onChange={e => {
									console.log('hi');
									setMessage(e.target.value);
								}}
								placeholder={`Respond to ${data.getUserChats &&
									data.getUserChats.find(x => x.id === chatPage).users.find(x => x.id !== user.id)
										.firstName}`}
								value={message}
								onKeyDown={e => {
									if (e.keyCode === 13) {
										sendMessage({
											variables: {
												id: data.getUserChats
													.find(x => x.id === chatPage)
													.users.find(x => x.id !== user.id).id,
												message,
											},
										});
									}
								}}
							/>
						</form>,
					]
				) : (
					[]
				)
			}
		/>
	);
};

export default withSnackbar(withRouter(withStyles(styles)(Chat)));

{
	/* Router.push(
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
										)} */
}
