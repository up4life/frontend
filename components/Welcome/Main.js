import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Button from '../../styledComponents/CustomButtons/Button';
import Logo from '../Header/UpFor';
import Verify from '../verifyPhone';
import { withStyles } from '@material-ui/core';
import styles from '../../static/jss/Welcome/welcomeStyles';

const Main = ({ user, classes }) => {
	return (
		<div className={classes.pageWrapper}>
			<div className={classes.innerWrapper}>
				<h2 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
					<span style={{ marginRight: '20px' }}>Welcome to</span>
					{<Logo />}
					<span style={{ marginLeft: '6px' }}>{user.firstName}!</span>
				</h2>
				<h3 style={{ textAlign: 'center' }}>Tell us a little about yourself...</h3>
				<Button
					color='danger'
					style={{ zIndex: 1, marginBottom: '15px' }}
					onClick={() => {
						Router.push(
							`/welcome?slug=1`,
							`/welcome/profile/gender`,
							{ shallow: true },
							{ scroll: false },
						);
					}}
				>
					Get Started
				</Button>
				<Verify />
			</div>
		</div>
	);
};

export default withStyles(styles)(Main);
