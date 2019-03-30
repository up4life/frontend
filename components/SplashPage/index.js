import React, { useEffect, useState } from 'react';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';
//components
import Register from './Register';
import Login from './Login';
//styled components
import Parallax from '../../styledComponents/Parallax/Parallax';
import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';
import Button from '../../styledComponents/CustomButtons/Button';
//styles
import Styles from '../../static/jss/Splash';
import Logo from '../Header/UpFor';

const Splash = ({ classes }) => {
	const [ registerShowing, setRegisterShowing ] = useState(false);
	const [ loginShowing, setLoginShowing ] = useState(false);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div>
			<Parallax>
				<div className={classes.container}>
					<GridContainer>
						<GridItem
							container
							justify='center'
							alignItems='center'
							direction='column'
							xs={12}
							sm={8}
							md={12}
						>
							<Logo main='true' />

							<div className={classes.tagline}>
								<Typography color='inherit' variant='h2'>
									Meet People. Go Places.
								</Typography>
							</div>
							<div>
								<GridContainer className={classes.centerGrid}>
									<Button
										className={classes.registerButton}
										color='danger'
										size='lg'
										onClick={() => setRegisterShowing(true)}
									>
										Sign Up
									</Button>

									<Button color='info' onClick={() => setLoginShowing(true)}>
										Log In
									</Button>
								</GridContainer>
							</div>
						</GridItem>
						<Register showing={registerShowing} setShowing={setRegisterShowing} />
						<Login showing={loginShowing} setShowing={setLoginShowing} />
					</GridContainer>
				</div>
			</Parallax>
			<div className={`${classes.main} ${classes.mainRaised}`}>
				<div className={classes.container}>
					<h1>Hellooo</h1>
					<div>Helloooo</div>
				</div>
			</div>
		</div>
	);
};

export default withStyles(Styles)(Splash);
