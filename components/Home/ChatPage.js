import React, { useEffect, useState, Fragment, useRef } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Router, { withRouter } from 'next/router';
import Media from '../../styledComponents/Media/Media.jsx';
import styles from '../../static/jss/Home/eventsStyles';
import { Drawer, IconButton, ClickAwayListener, Badge, Fab, Tooltip } from '@material-ui/core';
import date from '../../utils/formatDate';

const ChatPage = ({ messages, classes, user, lastSeenMessage, fromUser }) => {
	const msgRef = useRef(null);

	return (
		<div style={{ overflowY: 'scroll' }} ref={msgRef}>
			{messages.map(msg => {
				let fromMatch = msg[0].from.id !== user.id;
				const img = msg[0].from.img.find(x => x.default).img_url;
				return (
					<Media
						currentUser={!fromMatch}
						key={msg[0].id}
						small
						avatar={img}
						avatarClick={e => {
							e.stopPropagation();
							fromMatch
								? Router.push(
										{
											pathname: router.pathname === '/' ? '/home' : router.pathname,
											query: {
												slug: router.query.slug,
												user: fromUser.id,
											},
										},
										router.query.slug
											? `${router.pathname}/${router.query.slug}/user/${fromUser.id}`
											: router.pathname === '/'
												? `/user/${fromUser.id}`
												: `${router.pathname}/user/${fromUser.id}`,
										{ shallow: true },
										{ scroll: false }
									)
								: null;
						}}
						title={
							<span style={{ color: '#fafafa', fontSize: '14px' }}>
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
													title={date(m.createdAt)}
													placement={fromMatch ? 'bottom-start' : 'bottom-end'}
												>
													<p
														style={{
															wordBreak: 'break-word',
															fontSize: '13px',
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
											{user.permissions !== 'FREE' &&
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
	);
};

export default withRouter(withStyles(styles)(ChatPage));
