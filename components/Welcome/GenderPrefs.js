import React, { useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core';
import styles from '../../static/jss/Welcome/welcomeStyles';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
import Button from '../../styledComponents/CustomButtons/Button';

const GenderPrefs = ({ classes }) => {
	const [ genderPrefs, setGenderPrefs ] = useState([]);

	const handleSetGender = pref => {
		if (genderPrefs.find(x => x === pref)) {
			setGenderPrefs(genderPrefs.filter(x => x !== pref));
		} else {
			setGenderPrefs([ ...genderPrefs, pref ]);
		}
	};

	return (
		<Mutation
			mutation={UPDATE_USER_MUTATION}
			variables={{ genderPrefs }}
			onCompleted={() => {
				NProgress.done();
				Router.push(
					`/welcome?slug=6`,
					`/welcome/profile/preferences/age`,
					{ shallow: true },
					{ scroll: false },
				);
			}}
		>
			{updateUser => (
				<div className={classes.pageWrapper}>
					<div className={classes.innerWrapper} style={{ position: 'relative' }}>
						<h2>I would like to meet...</h2>
						<Button
							color='danger'
							genderPrefs
							simple={!genderPrefs.find(x => x === 'MALE')}
							style={{ zIndex: 1 }}
							onClick={() => handleSetGender('MALE')}
						>
							Men
						</Button>
						<Button
							color='danger'
							genderPrefs
							simple={!genderPrefs.find(x => x === 'FEMALE')}
							style={{ zIndex: 1 }}
							onClick={() => handleSetGender('FEMALE')}
						>
							Women
						</Button>
						<Button
							color='danger'
							genderPrefs
							simple={!genderPrefs.find(x => x === 'OTHER')}
							style={{ zIndex: 1 }}
							onClick={() => handleSetGender('OTHER')}
						>
							Non-Binary
						</Button>

						<Button
							color='danger'
							style={{ zIndex: 1 }}
							disabled={!genderPrefs.length}
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
