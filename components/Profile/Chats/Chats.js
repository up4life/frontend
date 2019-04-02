import React, { useContext } from 'react';

import { Paper, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import LikedBy from '../LikedBy';
import ChatContainer from '../../SingleChatContainer';
import { ChatCtx } from '../../ConvoContainer';
import SmallChat from './SideView';

import GridContainer from '../../../styledComponents/Grid/GridContainer';
import GridItem from '../../../styledComponents/Grid/GridItem';

import styles from '../../../static/jss/material-kit-pro-react/views/componentsSections/basicsStyle.jsx';

const Chats = ({ classes }) => {
	const { formattedChats, chat, data, setChat, currentUser } = useContext(ChatCtx);

	return (
		<div className={classes.container} style={{ padding: '30px 0' }}>
			<GridContainer style={{ height: '100%', flexDirection: 'column', width: '100%' }}>
				<LikedBy user={currentUser} />
				<GridContainer style={{ height: 'calc(100vh - 300px)', overflow: 'auto', width: '100%' }}>
					<GridItem sm={12} md={4} lg={4} style={{ height: '100%' }}>
						<Paper
							style={{
								height: '100%',
								overflowY: 'auto',
								minWidth: '250px',
								backgroundColor: '#1f1e1e',
								backgroundImage:
									'url("https://www.transparenttextures.com/theme/images/transparent.png")',
							}}
							className={classes.paper}
						>
							<Typography
								variant='h6'
								gutterBottom
								style={{
									textAlign: 'center',
									padding: '7px',
									borderTopLeftRadius: '6px',
									color: 'white',
								}}
							>
								{' '}
								<div style={{ margin: '15px' }} className={classes.title}>
									Slidin' into your DMs
								</div>
							</Typography>
							<div
								style={{
									padding: '20px 5px 20px',
									maxHeight: '100%',
									overflowY: 'scroll',
								}}
							>
								{data.getUserChats &&
									formattedChats.map((c, i) => (
										<div
											key={c.id}
											style={{ cursor: 'pointer' }}
											onClick={() => {
												setChat(c.id);
											}}
										>
											<SmallChat chat={c} setChat={setChat} selectedChat={chat} />
										</div>
									))}
							</div>
						</Paper>
					</GridItem>
					<GridItem sm={12} md={8} lg={8} style={{ maxHeight: 'calc(100vh - 300px)' }}>
						<Paper
							className={classes.paper2}
							style={{
								height: '100%',
								backgroundColor: '#1f1e1e',
								backgroundImage:
									'url("https://www.transparenttextures.com/theme/images/transparent.png")',
							}}
						>
							<ChatContainer />
						</Paper>
					</GridItem>
				</GridContainer>
			</GridContainer>
		</div>
	);
};

export default withStyles(styles)(Chats);
