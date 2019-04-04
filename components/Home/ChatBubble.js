import React, { useContext } from 'react';
import Router, { withRouter } from 'next/router';

import ConvoContainer, { ChatCtx } from '../ConvoContainer';
import ChatContainer from '../SingleChatContainer';

import { Badge, Fab } from '@material-ui/core';
import { ChatBubbleRounded } from '@material-ui/icons';
import styles from '../../static/jss/Home/eventsStyles';

import date from '../../utils/formatDate';
import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';
import Button from '../../styledComponents/CustomButtons/Button.jsx';
import withStyles from '@material-ui/core/styles/withStyles';

const MsgButton = ({ classes }) => {
	const { data, currentUser } = useContext(ChatCtx);
	const newMessageCount = (newMessages, user) => {
		return newMessages.reduce((count, mess) => {
			let newcount = mess.messages.filter(msg => !msg.seen && msg.from.id !== user.id);

			return [ ...count, ...newcount ];
		}, []);
	};
	let newMessages = data.getUserChats ? newMessageCount(data.getUserChats, currentUser) : [];

	return (
		<Badge
			badgeContent={newMessages.length}
			classes={{ badge: `${classes.chatBadge} ` }}
			color='error'
		>
			<Fab color='secondary' aria-label='Add' component='div'>
				<ChatBubbleRounded className={classes.chatIcon} />
			</Fab>
		</Badge>
	);
};

const Page = ({ classes }) => {
	const { formattedChats, chat, data, setChat, currentUser } = useContext(ChatCtx);

	return (
		<CustomDropdown
			left
			dropUp
			caret={false}
			dropdownHeader={
				chat ? (
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h5 style={{ margin: 0 }}>
							{data.getUserChats &&
								data.getUserChats
									.find(x => x.id === chat.id)
									.users.find(x => x.id !== currentUser.id).firstName}
						</h5>
						<Button
							simple
							style={{ padding: 0 }}
							onClick={e => {
								e.stopPropagation();
								setChat(false);
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
			buttonText={<MsgButton classes={classes} />}
			buttonProps={{
				className: classes.navLink + ' ' + classes.imageDropdownButton,
				color: 'transparent',
			}}
			stuff={formattedChats && chat ? <ChatContainer small /> : null}
			dropdownList={
				formattedChats && !chat ? (
					data.getUserChats &&
					formattedChats.map((chat, i) => (
						<div
							onClick={e => {
								e.stopPropagation();
								setChat(chat.id);
							}}
							style={{
								display: 'flex',
								padding: '5px',
								borderRight: chat.newMsgs ? '4px solid #ff101f' : 'none',
								borderTopRightRadius: '3px',
								borderBottomRightRadius: '3px',
							}}
						>
							<img
								src={chat.img}
								style={{
									width: '45px',
									height: '45px',
									borderRadius: '6px',
									marginRight: '10px',
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
										<h4 className={classes.smallHeading}>{chat.from}</h4>
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
					))
				) : (
					[]
				)
			}
		/>
	);
};

const Chat = ({ classes }) => {
	return (
		<ConvoContainer>
			<Page classes={classes} />
		</ConvoContainer>
	);
};

export default withRouter(withStyles(styles)(Chat));
