import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'next/router';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Stepper, Step, StepLabel, MobileStepper, Hidden } from '@material-ui/core';
import User, { CURRENT_USER_QUERY } from '../Queries/User';
import Main from './Main';
import Info from './Info';
import Prefs from './Prefs';
import Age from './Age';
import More from './More';
import Interests from './Interests';
import Pro from './ProFeatures';

import style from '../../static/jss/Welcome/welcomeStyles';

import triangle1 from '../../static/img/triangle1.svg';
import triangle2 from '../../static/img/triangle2.svg';
import triangle3 from '../../static/img/triangle3.svg';
import triangle4 from '../../static/img/triangle4.svg';
import triangle5 from '../../static/img/triangle5.svg';
import triangle6 from '../../static/img/triangle6.svg';
import triangle7 from '../../static/img/triangle7.svg';
import triangle8 from '../../static/img/triangle8.svg';
import triangle9 from '../../static/img/triangle9.svg';

function getSteps() {
	return [ 'Welcome', 'Info', 'Age', 'More', 'Preferences', 'Interests', 'Go Pro' ];
}

function getStepContent(stepIndex, user) {
	switch (stepIndex) {
		case 0:
			return <Main user={user} />;
		case 1:
			return <Info />;
		case 2:
			return <Age />;
		case 3:
			return <More user={user} />;
		case 4:
			return <Prefs />;
		case 5:
			return <Interests />;
		case 6:
			return <Pro />;
		default:
			return <Main user={user} />;
	}
}

function getImage(stepIndex) {
	switch (stepIndex) {
		case 0:
			return triangle1;
		case 1:
			return triangle1;
		case 2:
			return triangle2;
		case 3:
			return triangle3;
		case 4:
			return triangle4;
		case 5:
			return triangle5;
		case 6:
			return triangle6;
		case 7:
			return triangle7;
		case 8:
			return triangle8;
		case 9:
			return triangle9;
		default:
			return triangle1;
	}
}

const Welcome = ({ classes, user, router: { prefetch, query } }) => {
	useEffect(
		() => {
			if (query.slug === 3) prefetch('/home');
		},
		[ query.slug ]
	);
	const steps = getSteps();
	// console.log(parseInt(query.slug));

	return (
		<User>
			{({ data: { currentUser } }) => (
				<div className={classes.pageHeader}>
					<img
						style={{
							height: '100%',
							width: '100%',
							position: 'absolute',
							zIndex: '-10',
						}}
						src={getImage(parseInt(query.slug))}
					/>
					<div
						style={{
							minHeight: '100vh',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
						className={classes.container}
					>
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='favoriteID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#FF8A8A' />
								<stop offset='50%' stopColor='#FF545F' />
								<stop offset='100%' stopColor='#ff101f' />
							</linearGradient>
						</svg>
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='chatID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#81d6e3' />
								<stop offset='50%' stopColor='#15C0DA' />
								<stop offset='100%' stopColor='#81d6e3' />
							</linearGradient>
						</svg>
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='eventID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#CABAC8' />
								<stop offset='50%' stopColor='#B661AB' />
								<stop offset='100%' stopColor='#AD74A6' />
							</linearGradient>
						</svg>
						<svg
							style={{ width: 0, height: 0, position: 'absolute' }}
							aria-hidden='true'
							focusable='false'
						>
							<linearGradient id='receiptID' x2='1' y2='1'>
								<stop offset='0%' stopColor='#8AC9C5' />
								<stop offset='50%' stopColor='#4CB5AE' />
								<stop offset='100%' stopColor='#37C5BC' />
							</linearGradient>
						</svg>
						{getStepContent(parseInt(query.slug), currentUser)}
						<Hidden smDown>
							<Stepper
								classes={{ root: classes.stepper, alternativeLabel: classes.step }}
								activeStep={parseInt(query.slug)}
								alternativeLabel
							>
								{steps.map(label => (
									<Step key={label}>
										<StepLabel
											// className={classes.activeIcon}
											classes={{
												label: classes.step,
											}}
											StepIconProps={{
												classes: {
													active: classes.active,
													completed: classes.completed,
												},
											}}
										>
											{label}
										</StepLabel>
									</Step>
								))}
							</Stepper>
						</Hidden>
						<Hidden mdUp>
							<MobileStepper
								className={classes.mobileStepper}
								activeStep={parseInt(query.slug)}
								classes={{
									dots: classes.dots,
									dot: classes.dot,
									dotActive: classes.dotActive,
								}}
								steps={10}
							/>
						</Hidden>
					</div>
				</div>
			)}
		</User>
	);
};

export default withRouter(withStyles(style)(Welcome));

// function getStepContent(stepIndex, user) {
//   switch (stepIndex) {
//     case "profile/getstarted":
//       return <Main user={user} />;
//     case "gender":
//       return <Gender />;
//     case "gender/preferences":
//       return <GenderPrefs />;
//     case "age":
//       return <Age />;
//     case "age/preferences":
//       return <AgePrefs />;
//     case "location":
//       return <Location />;
//     case "images":
//       return <Images user={user} />;
//     case "about":
//       return <Bio />;
//     case "pro":
//       return <Pro />;
//     default:
//       return null;
//   }
// }

// function getImage(stepIndex) {
//   switch (stepIndex) {
//     case "profile/getstarted":
//       return "../../static/img/triangle1.svg";
//     case "gender":
//       return "../../static/img/triangle2.svg";
//     case "gender/preferences":
//       return "../../static/img/triangle3.svg";
//     case "age":
//       return "../../static/img/triangle4.svg";
//     case "age/preferences":
//       return "../../static/img/triangle5.svg";
//     case "location":
//       return "../../static/img/triangle6.svg";
//     case "images":
//       return "../../static/img/triangle7.svg";
//     case "about":
//       return "../../static/img/triangl8.svg";
//     case "pro":
//       return "../../static/img/triangle1.svg";
//     default:
//       return null;
//   }
// }
