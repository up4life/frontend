import React, { useEffect, useState, Fragment, useRef } from 'react';
import NProgress from 'nprogress';
import { Mutation, withApollo } from 'react-apollo';
import { useMutation } from 'react-apollo-hooks';
import Router from 'next/router';
import moment from 'moment';
import gql from 'graphql-tag';
import { withStyles, ButtonBase, Tooltip } from '@material-ui/core';
import Verify from '../../verifyPhone';
import styles from '../../../static/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.jsx';
import Button from '../../../styledComponents/CustomButtons/Button';
import CustomInput from '../../../styledComponents/CustomInput/CustomInput.jsx';
import Media from '../../../styledComponents/Media/Media.jsx';
import { Send } from '@material-ui/icons';
import TextareaAutosize from 'react-autosize-textarea';
import scrollbar from '../../../static/jss/ScrollbarStyles';
import date from '../../../utils/formatDate';

const TOGGLE_TYPING_MUTATION = gql`
	mutation TOGGLE_TYPING_MUTATION($chatId: String!, $isTyping: Boolean!) {
		toggleTyping(chatId: $chatId, isTyping: $isTyping) {
			typing {
				id
				firstName
			}
		}
	}
`;

const SEND_MESSAGE_MUTATION = gql`
	mutation SEND_MESSAGE_MUTATION($id: String!, $message: String!) {
		sendMessage(id: $id, message: $message) {
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
`;

const MARK_SEEN = gql`
	mutation MARK_SEEN($chatId: String!) {
		markAllAsSeen(chatId: $chatId) {
			id
		}
	}
`;
const REMAINING_MESSAGES = gql`
	query {
		remainingMessages
	}
`;

const Chat = ({ chat, currentUser, classes, client }) => {
	const [ message, setMessage ] = useState('');
	const msgRef = useRef(null);
	const [ error, setError ] = useState(null);
	const markAllAsSeen = useMutation(MARK_SEEN);
	const [ isTyping, setIsTyping ] = useState(false);
	const toggleTyping = useMutation(TOGGLE_TYPING_MUTATION);

	useEffect(
		() => {
			if (chat && isTyping && !message.trim()) {
				toggleTyping({
					variables: {
						chatId: chat.id,
						isTyping: false,
					},
				});
				setIsTyping(false);
			}
			if (chat && !isTyping && message.trim()) {
				toggleTyping({
					variables: {
						chatId: chat.id,
						isTyping: true,
					},
				});
				setIsTyping(true);
			}
		},
		[ message ]
	);

	useEffect(() => {
		// if (!currentUser.verified) {
		// 	setError({
		// 		msg: 'You must verify your account before you can send messages!',
		// 		link: null,
		// 		linkText: 'Verify now?',
		// 	});
		// } else
		if (currentUser.permissions === 'FREE') {
			getRemainingMessages();
		}
	}, []);

	useEffect(() => {
		const unSeen = chat && chat.messages.filter(msg => !msg.seen && msg.from.id !== currentUser.id);

		if (unSeen && unSeen.length > 0) {
			markAllAsSeen({
				variables: {
					chatId: chat.id,
				},
			});
		}
	});

	useEffect(
		() => {
			if (msgRef.current) {
				msgRef.current.scrollTop = msgRef.current.scrollHeight;
			}
		},
		[ chat ]
	);
	const getRemainingMessages = async () => {
		let messagesRemaining = await client.query({
			query: REMAINING_MESSAGES,
			fetchPolicy: 'no-cache',
		});
		if (messagesRemaining.data.remainingMessages === 0) {
			setError({
				msg: 'You are out of weekly messages allowed on a free account!',
				link: '/profile/billing',
				linkText: 'Go Pro?',
			});
		}
	};

	let friend;
	if (chat) {
		friend = chat.users.find(user => user.id !== currentUser.id);
	}

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

	let messages = chat && chat.messages.length ? groupByUser(chat.messages) : null;
	let lastSeenMessage = chat
		? [ ...chat.messages ].reverse().find(x => x.from.id === currentUser.id && x.seen)
		: null;
	return (
		<div
			style={{
				flexGrow: 1,
				height: '100%',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<div className={classes.messageList} ref={msgRef}>
				{chat &&
					messages.map(msg => {
						let fromMatch = msg[0].from.id !== currentUser.id;
						const img = msg[0].from.img.find(x => x.default).img_url;
						return (
							<Media
								currentUser={!fromMatch}
								key={msg[0].id}
								avatar={img}
								avatarClick={() =>
									fromMatch
										? Router.push(
												`/profile?slug=chats&user=${msg[0].from.id}`,
												`/profile/chat/user/${msg[0].from.id}`,
												{ shallow: true },
												{ scroll: false }
											)
										: null}
								title={
									<span style={{ color: '#fafafa' }}>
										{msg[0].from.firstName}{' '}
										{/* <small style={{ fontSize: '12px' }}>
											· {moment(msg.createdAt).fromNow()}
										</small> */}
									</span>
								}
								body={
									<span>
										{msg.map((m, i) => {
											return (
												<div key={m.id}>
													<div
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															flexDirection: fromMatch ? 'row' : 'row-reverse',
														}}
													>
														<Tooltip
															title={moment(m.createdAt).format('MMM Do h:mm a')}
															placement={fromMatch ? 'bottom-start' : 'bottom-end'}
														>
															<p
																style={{
																	wordBreak: 'break-word',
																	fontSize: '14px',
																	cursor: 'default',
																}}
															>
																{m.text}
															</p>
														</Tooltip>
														<small
															style={{
																marginBottom: '10px',
																marginLeft: '5px',
																marginRight: '5px',
																display: 'none',
															}}
														>
															{' '}
															{date(msg.createdAt)}
														</small>
													</div>
													{currentUser.permissions !== 'FREE' &&
													!fromMatch &&
													lastSeenMessage &&
													lastSeenMessage.id === m.id ? (
														<div>
															<small>
																<span style={{ marginRight: '2px' }}>seen</span>
																{date(lastSeenMessage.updatedAt)}
															</small>
														</div>
													) : null}
												</div>
											);
										})}
									</span>
								}
							/>
						);
					})}
			</div>
			{chat && (
				<Mutation
					mutation={SEND_MESSAGE_MUTATION}
					variables={{ id: friend.id, message }}
					onCompleted={() => {
						NProgress.done();
						if (currentUser.permissions === 'FREE') {
							getRemainingMessages();
						}
					}}
					onError={e => {
						NProgress.done();
						// e.message.includes('free')
						// 	? setError({
						// 			msg: 'You are out of weekly messages allowed on a free account!',
						// 			link: '/profile/billing',
						// 			linkText: 'Go Pro?',
						// 		})
						// 	: null;
					}}
				>
					{sendMessage =>
						error ? !error.link ? (
							<Verify />
						) : (
							<div>
								<h4>{error.msg}</h4>
								<Button onClick={() => Router.push(error.link)}>{error.linkText}</Button>
							</div>
						) : (
							<form
								className={classes.expandedChat}
								onSubmit={e => {
									e.preventDefault();
									NProgress.start();
									sendMessage();
									setMessage('');
								}}
							>
								{/* <CustomInput
									id='logged'
									formControlProps={{
										fullWidth: true,
									}}
									inputProps={{
										multiline: true,
										rows: '3',
										// rows: Math.ceil(message.length / 60),
										placeholder: `Respond to ${friend.firstName}`,
										value: message,
										onChange: e => setMessage(e.target.value),
										style: { color: '#fafafa', width: '80%' },
									}}
								/> */}
								<TextareaAutosize
									className={classes.textareaAutosize}
									onChange={e => {
										setMessage(e.target.value);
									}}
									placehotruncatelder={`Respond to ${friend.firstName}`}
									rows={1}
									maxRows={4}
									value={message}
									onKeyDown={e => {
										if (e.keyCode === 13) {
											sendMessage();
											setMessage('');
										}
									}}
								/>
								<ButtonBase type='submit'>
									<Button
										style={{
											background: 'transparent',
											borderRadius: '6px !important',
										}}
										justIcon
										className={classes.floatRight}
										component='div'
									>
										<Send />
									</Button>
								</ButtonBase>
							</form>
						)}
				</Mutation>
			)}
			{chat && (
				<div>
					{chat.typing.find(user => user.firstName === friend.firstName) ? (
						`${friend.firstName} is typing...`
					) : (
						''
					)}
				</div>
			)}
		</div>
	);
};

export default withApollo(withStyles(styles)(Chat));
