import React, { useEffect, useState, Fragment } from 'react';
import { Dialog } from '@material-ui/core';
import Terms from '../SplashPage/Terms';
import Styles from '../../static/jss/Splash';
import withStyles from '@material-ui/core/styles/withStyles';
import Transition from '../Transistion';
import Card from '../../styledComponents/Card/Card';

const TermsModal = ({ classes, showing, setShowing }) => {
	return (
		<Dialog
			classes={{
				root: classes.modalRoot,
				paper: classes.modal + ' ' + classes.modalSignup,
				container: classes.modalContainer,
			}}
			open={showing}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => {
				setShowing(false);
			}}
		>
			<Card plain className={classes.modalSignupCard + ' ' + classes.register}>
				<Terms setTermsShowing={setShowing} />
			</Card>
		</Dialog>
	);
};

export default withStyles(Styles)(TermsModal);
