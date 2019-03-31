import React, { useState, useEffect, useRef, useLayoutEffect, Fragment } from 'react';
import moment from 'moment';
import NProgress from 'nprogress';
import { useMutation } from '../Mutations/useMutation';
import Router from 'next/router';
import posed from 'react-pose';

//query& M
import { CURRENT_USER_QUERY } from '../Queries/User';
import { ADD_EVENT_MUTATION } from '../Mutations/addEvent';
import { DELETE_EVENT_MUTATION } from '../Mutations/updateUser';
import { ALL_EVENTS_QUERY } from '../Queries/AllEvents';
//MUI
import {
	Favorite,
	ChatBubble as Chat,
	SubdirectoryArrowRightRounded as Flipper,
	SubdirectoryArrowLeftRounded as Flopper,
} from '@material-ui/icons';
import { Typography, Avatar, Badge, Tooltip } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

//Images
import Arrow from '../../static/img/up4Arrow.png';
import standIn from '../../static/img/placeholder.jpg';

//Components
import Up4 from './UpFor';
import ErrorModal from '../SplashPage/ErrorModal';
//Styled components
import Card from '../../styledComponents/Card/Card';
import CardHeader from '../../styledComponents/Card/CardHeader';
import CardFooter from '../../styledComponents/Card/CardFooter';
import CardBody from '../../styledComponents/Card/CardBody';
import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';

//utils
import getAge from '../../utils/getAge';

//styles
import CardStyles from '../../static/jss/material-kit-pro-react/views/componentsSections/sectionCards';

const UserImage = posed.img({
	hidden: {
		opacity: 0,
		y: '40px',
	},
	liked: {
		opacity: 1,
		y: 0,
	},
});

const LikedBy = posed.div({
	liked: {
		x: 0,
	},
	unliked: {
		x: '-40px',
	},
});
const Event = ({ event, classes, user, first }) => {
	const useIsomorphicLayoutEffect = process.Browser ? useLayoutEffect : useEffect;
	let [ isSaved, setIsSaved ] = useState(false);

	useEffect(() => {
		setIsSaved(user.events.find(e => e.id === event.id || e.tmID === event.tmID) ? true : false);
	}, []);

	const [ deleteEvent ] = useMutation(DELETE_EVENT_MUTATION, {
		update: (cache, { data }) => {
			const { currentUser } = cache.readQuery({
				query: CURRENT_USER_QUERY,
			});

			cache.writeQuery({
				query: CURRENT_USER_QUERY,
				data: {
					currentUser: {
						...currentUser,
						events: currentUser.events.filter(x => x.id !== event.id),
					},
				},
			});
		},
		variables: { id: event.id },
		onCompleted: e => {
			setIsSaved(false);
			NProgress.done();
		},
		onError: e => console.log(e),
	});

	const [ addEvent ] = useMutation(ADD_EVENT_MUTATION, {
		variables: {
			tmID: event.tmID,
			title: event.title,
			venue: event.venue,
			image_url: event.image_url,
			times: event.times,
			city: event.city,
			category: event.category,
			genre: event.genre,
		},
		update: (cache, { data: { addEvent } }) => {
			try {
				const { currentUser } = cache.readQuery({
					query: CURRENT_USER_QUERY,
				});
				console.log(addEvent);
				cache.writeQuery({
					query: CURRENT_USER_QUERY,
					data: {
						currentUser: {
							...currentUser,
							events: [ ...currentUser.events, addEvent ],
						},
					},
				});
			} catch (err) {
				console.log(err);
			}
		},
		onError: e => {
			NProgress.done();
			console.error(e);
			setError(e);
		},
		onCompleted: () => {
			setIsSaved(true);
			NProgress.done();
		},
	});
	const [ error, setError ] = useState(null);
	const [ rotate, setRotate ] = useState('');
	const [ height, setHeight ] = useState(0);
	const [ val, set ] = useState(false);
	const divEl = useRef(null);
	const imgEl = useRef(null);

	useIsomorphicLayoutEffect(
		() => {
			NProgress.start();
			if (imgEl.current) {
				if (imgEl.current.complete) set(true);
			}
		},
		[ imgEl ]
	);

	useIsomorphicLayoutEffect(
		() => {
			if (val) {
				setHeight(`${divEl.current.clientHeight}px`);
				NProgress.done();
			}
		},
		[ val ]
	);

	event.times = event.times.sort((a, b) => {
		let dateA = new Date(a);
		let dateB = new Date(b);
		return dateA - dateB;
	});

	return (
		<div
			style={{
				height: 'max-content',
				position: 'relative',
				opacity: height === 0 ? '0' : '1',
			}}
		>
			{error ? <ErrorModal error={error} billing /> : null}
			<div
				style={{ height: height }}
				className={`${classes.rotatingCardContainer} ${classes.manualRotate} ${rotate}`}
			>
				<Card blog className={classes.cardRotate}>
					<div ref={divEl} className={`${classes.front} ${classes.eventBorder}`}>
						{event.image_url && (
							<CardHeader style={{ position: 'relative' }} image>
								<img
									style={{ border: '1px solid #cabac8' }}
									ref={imgEl}
									src={event.image_url}
									alt='...'
									onLoad={() => {
										set(true);
									}}
								/>

								<div
									className={`${classes.coloredShadow} `}
									style={{
										backgroundImage: `url(${event.image_url})`,
										opacity: '1',
									}}
								/>

								<div className={isSaved ? `${classes.up4} ${classes.up4Saved}` : classes.up4}>
									<div style={{ cursor: 'pointer' }}>
										{isSaved ? (
											<div
												onClick={() => {
													NProgress.start();
													deleteEvent();
												}}
											>
												<img className={classes.arrow} src={Arrow} />
											</div>
										) : (
											<Tooltip
												open={first && !user.events.length}
												classes={{
													tooltip: classes.tooltippy,
												}}
												placement='top'
												title='Click here to express your interest in
															an event!'
											>
												<Up4
													handleClick={() => {
														NProgress.start();
														addEvent();
													}}
													justFour
												/>
											</Tooltip>
										)}
									</div>
								</div>
							</CardHeader>
						)}
						<CardBody className={classes.cardBodyRotate} style={{ paddingBottom: 0 }}>
							<Typography variant='h4' className={classes.cardTitle}>
								{event.title}
							</Typography>

							<div className={classes.gradientBorder}>
								{event.venue}
								<div className={`${classes.stats} ${classes.mlAuto}`} style={{ display: 'block' }}>
									{event.times.length > 2 ? (
										<div>
											{moment(event.times[0]).calendar()} -{' '}
											{moment(event.times[event.times.length - 1]).calendar()}
										</div>
									) : (
										event.times.map((time, i) => <div key={i}>{moment(time).calendar()}</div>)
									)}
								</div>
							</div>
						</CardBody>

						<CardFooter
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								paddingBottom: '10px',
							}}
						>
							<div style={{ display: 'flex' }}>
								{/* {isSaved ? ( */}
								<UserImage
									src={user.img.find(img => img.default).img_url}
									className={classes.lilImg}
									pose={isSaved ? 'liked' : 'hidden'}
								/>
								{event.attending.length ? (
									<LikedBy style={{ display: 'flex' }} pose={isSaved ? 'liked' : 'unliked'}>
										{event.attending.filter(x => x.id !== user.id).map(usr => {
											let chat = user
												? user.chats.find(x =>
														x.messages.some(y => y.from.id === usr.id && !y.seen)
													)
												: false;

											return (
												<Badge
													invisible={!chat}
													color='primary'
													variant='dot'
													key={usr.id}
													classes={{ badge: classes.smallBadge }}
												>
													<img
														onClick={() => {
															NProgress.start();
															Router.push(
																`/home?user=${usr.id}`,
																`/home/user/${usr.id}`,
																{ shallow: true },
																{ scroll: false }
															);
														}}
														src={
															usr.img.length ? usr.img.find(img => img.default).img_url : standIn
														}
														className={classes.lilImg}
													/>
												</Badge>
											);
										})}
									</LikedBy>
								) : (
									<div
										style={{
											width: '40px',
											height: '40px',
										}}
									/>
								)}
							</div>

							<div onClick={() => setRotate(classes.activateRotate)} className={classes.flip}>
								<Flipper className={classes.flipper} style={{ fontSize: '36px' }} />
							</div>
						</CardFooter>
					</div>
					<GridContainer
						style={{
							height: 'auto',
							margin: 0,
						}}
						className={`${classes.back} ${classes.eventBorderBack} `}
					>
						<GridItem sm={12} md={12}>
							<img
								className={classes.reversedImage}
								// style={{ border: "1px solid #cabac8", position: "absolute", width: '100%', top: '-20px', left: 0 }}
								ref={imgEl}
								src={event.image_url}
								alt='...'
								onLoad={() => {
									set(true);
								}}
							/>
							<div
								style={{
									left: '12px',
									top: '-25px',
									borderTopRightRadius: '0px',
									borderTopLeftRadius: '6px',
									borderBottomRightRadius: '6px',
									zIndex: '700',
									opacity: '.9',
								}}
								className={isSaved ? `${classes.up4} ${classes.up4Saved}` : classes.up4}
							>
								<div style={{ cursor: 'pointer' }}>
									{isSaved ? (
										<div
											onClick={() => {
												NProgress.start();
												deleteEvent();
											}}
										>
											<img className={classes.arrow} src={Arrow} />
										</div>
									) : (
										<Tooltip
											open={first && !user.events.length}
											classes={{
												tooltip: classes.tooltippy,
											}}
											placement='top'
											title='Click here to express your interest in
															an event!'
										>
											<Up4
												handleClick={() => {
													NProgress.start();
													addEvent();
												}}
												justFour
											/>
										</Tooltip>
									)}
								</div>
							</div>
							<CardBody
								style={{
									height: divEl.current ? `${divEl.current.clientHeight}px` : height,
								}}
								className={`${classes.cardBodyRotate} ${classes.cardBodyReverse}`}
							>
								<div className={classes.cardBodyRotateHeader}>
									<div>
										<h3 className={classes.cardTitle}>
											<a href='#' onClick={e => e.preventDefault()}>
												{event.title}
											</a>
										</h3>
										<h6 style={{ color: '#263238', fontSize: '15px' }}>
											Showing
											{!user || !user.genderPrefs.length || user.genderPrefs.length === 3 ? (
												<span className='genderPreference'>everyone</span>
											) : user.genderPrefs.includes('MALE') ? user.genderPrefs.includes(
												'FEMALE'
											) ? (
												<span className='genderPreference'>men and women</span>
											) : (
												<span className='genderPreference'>men</span>
											) : (
												<span className='genderPreference'>women</span>
											)}{' '}
											between the ages of{' '}
											<span style={{ marginRight: '3px' }} className='agePreference'>
												{user && user.minAgePref ? user.minAgePref : '18'}
											</span>
											and{' '}
											<span className='agePreference'>
												{user && user.maxAgePref ? user.maxAgePref : '100'}
											</span>
										</h6>
									</div>
								</div>
								<GridContainer style={{ maxHeight: '335px', overflow: 'scroll' }}>
									{!event.attending.length > 0 ? (
										<div style={{ width: '100%' }}>
											<div>
												<p>Be the First to be Up For this Event</p>
											</div>
											<img
												style={{
													filter: 'grayscale(50%)',
													opacity: '.5',
													height: '260px',
												}}
												src={Arrow}
											/>
											<small style={{ display: 'block' }}>
												In fashion you are what is known as a trendsetter
											</small>
										</div>
									) : (
										event.attending.map(usr => {
											let chat = user
												? user.chats.find(x => x.users.some(y => y.id === usr.id))
												: false;
											let newChat = user
												? user.chats.find(x =>
														x.messages.some(y => y.from.id === usr.id && !y.seen)
													)
												: false;
											let liked = user ? user.liked.find(x => x.id === usr.id) : false;

											return (
												<GridItem
													key={usr.id}
													xs={6}
													sm={6}
													md={4}
													style={{
														padding: '5px',
														position: 'relative',
														minWidth: '150px',
														maxWidth: '170px',
													}}
												>
													{liked && <Favorite className={classes.favorite} />}
													{chat && (
														<Badge
															invisible={!newChat}
															color='primary'
															variant='dot'
															classes={{
																root: classes.newChat,
																badge: classes.chatBadge,
															}}
														>
															<Chat className={classes.chat} />
														</Badge>
													)}
													<div
														onClick={() => {
															NProgress.start();
															Router.push(
																`/home?user=${usr.id}`,
																`/home/user/${usr.id}`,
																{ shallow: true },
																{ scroll: false }
															);
														}}
														style={{}}
													>
														<div className={` ${classes.gradientBorder}  ${classes.userCard}`}>
															<Avatar
																src={
																	usr.img.length ? (
																		usr.img.find(img => img.default).img_url
																	) : (
																		standIn
																	)
																}
																imgProps={{ height: 70, width: 70 }}
																style={{
																	width: '100%',
																	height: '124px',
																	borderRadius: '6px',
																}}
															/>
															<div
																style={{
																	display: 'flex',
																	justifyContent: 'center',
																}}
															>
																<p style={{ margin: 0 }}>
																	{usr.firstName} <span style={{ padding: '0 3px' }}>&#8226;</span>
																</p>
																<p style={{ margin: '0 0 0 2px' }}>{getAge(usr.dob)}</p>
															</div>
														</div>
													</div>
												</GridItem>
											);
										})
									)}
								</GridContainer>
								<div
									onClick={() => setRotate('')}
									className={` ${classes.flip} ${classes.flop}`}
									style={{ bottom: 0 }}
								>
									<Flopper className={classes.flipper} style={{ fontSize: '36px' }} />
								</div>
							</CardBody>
						</GridItem>
					</GridContainer>
				</Card>
			</div>
		</div>
	);
};

export default withStyles(CardStyles)(Event);
