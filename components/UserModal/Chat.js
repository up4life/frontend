import React, { useState, useEffect, useRef, Fragment } from 'react';
import NProgress from 'nprogress';
import moment from 'moment';
import Router from 'next/router';
import gql from 'graphql-tag';

import withStyles from '@material-ui/core/styles/withStyles';
import { Send } from '@material-ui/icons';

import { Mutation, withApollo } from 'react-apollo';
import { useMutation } from 'react-apollo-hooks';

// import { SEND_MESSAGE_MUTATION } from '../Mutations/sendMessage';
import Verify from '../verifyPhone';
import CustomInput from '../../styledComponents/CustomInput/CustomInput.jsx';
import Media from '../../styledComponents/Media/Media.jsx';
import Button from '../../styledComponents/CustomButtons/Button';
import { ButtonBase } from '@material-ui/core';
import TextareaAutosize from 'react-autosize-textarea';

import styles from '../../static/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.jsx';

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

const Chat = ({
	classes,
	data,
	id,
	currentUser,
	subscribeToNewMessages,
	match,
	client,
	refetch,
}) => {
	const [ message, setMessage ] = useState('');
	const [ error, setError ] = useState(null);
	const markAllAsSeen = useMutation(MARK_SEEN);
	const msgRef = useRef(null);

	//Flip flop this lil guy
	currentUser.verified = true;

	useEffect(() => {
		subscribeToNewMessages();
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
	useEffect(
		() => {
			if (msgRef.current) {
				msgRef.current.scrollTop = msgRef.current.scrollHeight;
			}
		},
		[ data.getConversation ],
	);
	useEffect(() => {
		const unSeen =
			data &&
			data.getConversation &&
			data.getConversation.messages.filter(
				msg => !msg.seen && msg.from.id !== currentUser.id,
			);

		if (unSeen && unSeen.length > 0) {
			markAllAsSeen({
				variables: {
					chatId: data.getConversation.id,
				},
			});
		}
	});
	const getRemainingMessages = async () => {
		let messagesRemaining = await client.query({ query: REMAINING_MESSAGES });
		if (messagesRemaining.data.remainingMessages === 0) {
			setError({
				msg: 'You are out of weekly messages allowed on a free account!',
				link: '/profile/billing',
				linkText: 'Go Pro?',
			});
		}
	};
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

	let messages =
		data.getConversation && data.getConversation.messages.length
			? groupByUser(data.getConversation.messages)
			: null;

	return (
		<div className={classes.chatBorder}>
			<div className={classes.chat} ref={msgRef}>
				{messages ? (
					messages.map((msg, i) => {
						let seenMsgs = msg.map(x => x.seen);
						let lastSeen = seenMsgs.lastIndexOf(true);
						console.log(lastSeen);
						let fromMatch = msg[0].from.id === id;
						let unseen = !msg[0].seen && msg[0].from.id !== currentUser.id;
						let img = msg[0].from.img.find(img => img.default).img_url;
						return (
							<Media
								currentUser={!fromMatch}
								key={msg[0].id}
								avatar={img}
								title={
									<span style={{ color: '#fafafa' }}>
										{msg[0].from.firstName}
										<small
											style={{
												fontWeight: unseen && 'bold',
												fontSize: '12px',
											}}
										>
											{/* · {moment(msg.createdAt).fromNow()} */}
											{unseen ? (
												<span style={{ color: 'red', marginLeft: '6px' }}>
													new
												</span>
											) : null}
										</small>
									</span>
								}
								body={
									<span>
										{msg.map((m, i) => {
											let lastSeenMsg = i === lastSeen;
											return (
												<div>
													<div
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															flexDirection: fromMatch
																? 'row'
																: 'row-reverse',
														}}
													>
														<p
															style={{
																wordBreak: 'break-word',
																fontSize: '14px',
															}}
														>
															{m.text}
														</p>{' '}
														<small
															style={{
																marginBottom: '10px',
																marginLeft: '5px',
																marginRight: '5px',
																display: 'none',
															}}
														>
															{' '}
															{moment(msg.createdAt).fromNow()}
														</small>
													</div>
													{currentUser.permissions !== 'FREE' &&
													!fromMatch &&
													lastSeenMsg ? (
														<div>
															<small>
																<span
																	style={{ marginRight: '2px' }}
																>
																	seen
																</span>
																{moment(
																	msg[msg.length - 1].updatedAt,
																).format('M/D/YY h:mm a')}
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
					})
				) : (
					<h4 style={{ color: '#fafafa', fontStyle: 'italic' }}>
						No message history to show with {match.firstName}.<br /> Send a message to
						see what {match.firstName} is up4!
					</h4>
				)}
			</div>
			<Mutation
				mutation={SEND_MESSAGE_MUTATION}
				variables={{ id, message }}
				onCompleted={e => {
					refetch();
					NProgress.done();
				}}
				onError={e => {
					console.log(e);
					NProgress.done();
				}}
			>
				{sendMessage =>
					error ? !error.link ? (
						<Verify />
					) : (
						<div>
							<h4>{error.msg}</h4>
							<Button
								onClick={() => Router.push('/profile?slug=billing', error.link)}
							>
								{error.linkText}
							</Button>
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
							<TextareaAutosize
								className={classes.textareaAutosize}
								onChange={e => setMessage(e.target.value)}
								placeholder={
									data.getConversation ? (
										`Respond to ${match.firstName}`
									) : (
										`Send ${match.firstName} a message.`
									)
								}
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
		</div>
	);
};

export default withApollo(withStyles(styles)(Chat));
