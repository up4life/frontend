import React, { useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Mutation } from 'react-apollo';
import InputRange from 'react-input-range';
import withStyles from '@material-ui/core/styles/withStyles';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
import Button from '../../styledComponents/CustomButtons/Button';

import styles from '../../static/jss/Welcome/welcomeStyles';

const GenderPrefs = ({ classes }) => {
	const [ agePref, setAgePref ] = useState({
		min: 18,
		max: 50,
	});

	return (
		<Mutation
			mutation={UPDATE_USER_MUTATION}
			variables={{
				minAgePref: agePref.min,
				maxAgePref: agePref.max,
			}}
			onCompleted={() => {
				NProgress.done();
				Router.push(
					`/welcome?slug=7`,
					`/welcome/profile/about`,
					{ shallow: true },
					{ scroll: false },
				);
			}}
		>
			{updateUser => (
				<div className={classes.pageWrapper}>
					<div className={classes.innerWrapper} style={{ position: 'relative' }}>
						<h2 style={{ marginBottom: '20px' }}>Between the ages of...</h2>
						<div className={classes.inputRange} style={{ width: '100%' }}>
							<InputRange
								minLabel='range-label'
								maxLabel='range-label'
								maxValue={80}
								minValue={18}
								value={agePref}
								onChange={value => setAgePref(value)}
							/>
						</div>
						<Button
							color='danger'
							style={{ zIndex: 1 }}
							onClick={() => {
								NProgress.start();
								updateUser();
							}}
						>
							Next
						</Button>
						<Button
							size='sm'
							simple
							style={{ position: 'absolute', bottom: 0, right: 0 }}
							onClick={() => Router.push('/home')}
						>
							Skip For Now
						</Button>
					</div>
				</div>
			)}
		</Mutation>
	);
};

export default withStyles(styles)(GenderPrefs);
