import React, { useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '../../styledComponents/CustomButtons/Button';
import '../../styles/Profile/index.scss';
import styles from '../../static/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.jsx';

import { openUploadWidget } from '../../utils/cloudinary';
import Styles from '../../static/jss/Welcome/welcomeStyles';
const UPLOAD_IMAGE_MUTATION = gql`
	mutation UPLOAD_IMAGE_MUTATION($url: String!) {
		uploadImage(url: $url) {
			id
			img {
				id
				img_url
				default
			}
		}
	}
`;
const GenderPrefs = ({ user, classes }) => {
	const handleUpload = async uploadImage => {
		openUploadWidget((error, result) => {
			// console.log(result.event);
			if (result.event === 'success') {
				NProgress.start();
				uploadImage({
					variables: {
						url: result.info.secure_url,
					},
				});
			}
		});
	};

	return (
		<Mutation
			mutation={UPLOAD_IMAGE_MUTATION}
			onCompleted={e => {
				NProgress.done();
			}}
			onError={e => console.log(e)}
		>
			{uploadImage => (
				<div className={classes.pageWrapper}>
					<div
						className={classes.innerWrapper}
						style={{
							position: 'relative',
						}}
					>
						<h2>I look like...</h2>
						<div className={'thumbnail'}>
							{user.img.length ? (
								<img src={user.img.find(x => x.default).img_url} alt='...' />
							) : null}
						</div>
						<div style={{ display: 'flex' }}>
							<Button
								color='danger'
								onClick={() => {
									handleUpload(uploadImage);
								}}
							>
								{user.img.length ? 'Change' : 'Upload'}
							</Button>
							{user.img.length ? (
								<Button
									color='danger'
									onClick={() =>
										Router.push(
											`/welcome?slug=5`,
											`/welcome/profile/preferences/gender`,
											{ shallow: true },
											{ scroll: false },
										)}
								>
									Next
								</Button>
							) : null}
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
				</div>
			)}
		</Mutation>
	);
};

export default withStyles({ ...styles, ...Styles })(GenderPrefs);
