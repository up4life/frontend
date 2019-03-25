import React from 'react';
import Router, { Link } from 'next/router';
import NProgress from 'nprogress';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core';
import styles from '../../static/jss/Welcome/welcomeStyles';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
import Button from '../../styledComponents/CustomButtons/Button';

const Gender = ({ user, classes }) => {
	const handleSelect = (value, updateUser) => {
		NProgress.start();
		updateUser({ variables: { gender: value } });
	};
	return (
		<Mutation
			mutation={UPDATE_USER_MUTATION}
			onCompleted={() => {
				NProgress.done();
				Router.push(
					`/welcome?slug=2`,
					`/welcome/profile/age`,
					{ shallow: true },
					{ scroll: false },
				);
			}}
		>
			{updateUser => (
				<div className={classes.pageWrapper}>
					<div
						className={classes.innerWrapper}
						style={{ alignItems: 'stretch', padding: '90px' }}
					>
						<h2>I am a...</h2>
						<Button
							color='danger'
							style={{ zIndex: 1 }}
							onClick={() => handleSelect('MALE', updateUser)}
						>
							Man
						</Button>
						<Button
							color='danger'
							style={{ zIndex: 1 }}
							onClick={() => handleSelect('FEMALE', updateUser)}
						>
							Woman
						</Button>
						<Button
							color='danger'
							style={{ zIndex: 1 }}
							onClick={() => handleSelect('OTHER', updateUser)}
						>
							Non-Binary
						</Button>
					</div>
				</div>
			)}
		</Mutation>
	);
};

export default withStyles(styles)(Gender);
