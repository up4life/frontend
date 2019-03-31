import React, { useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { InputLabel, Tooltip } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import CustomInput from '../../styledComponents/CustomInput/CustomInput.jsx';
import Button from '../../styledComponents/CustomButtons/Button';

import { openUploadWidget } from '../../utils/cloudinary';

import styles from '../../static/jss/Welcome/welcomeStyles';

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
const MoreInfo = ({ user, classes }) => {
	const [ bio, setBio ] = useState('');
	const [ charsLeft, setCharsLeft ] = useState(350 - bio.length);

	const handleInput = ({ target: { value } }) => {
		setBio(value);
		setCharsLeft(350 - value.length);
	};
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
				<div className={classes.innerWrapper}>
					<h2>More about me...</h2>
					<div style={{ display: 'flex', alignItems: 'flex-end' }}>
						<div className='thumbnail' style={{ width: '70%', margin: '0 auto' }}>
							{user.img.length ? (
								<img src={user.img.find(x => x.default).img_url} alt='...' />
							) : null}
						</div>
						<div style={{ display: 'flex' }}>
							<Button
								simple
								color='danger'
								onClick={() => {
									handleUpload(uploadImage);
								}}
							>
								{user.img.length ? 'Change' : 'Upload'}
							</Button>
						</div>
					</div>
					<div style={{ width: '100%' }}>
						<CustomInput
							//labelText='About'

							formControlProps={{
								fullWidth: true,
							}}
							id='textarea-input'
							inputProps={{
								multiline: true,
								rows: 4,
								value: bio,
								onChange: e => handleInput(e),
								placeholder: 'Write a little about yourself',
								value: `${charsLeft > 0 ? bio : bio.slice(0, 350)}`,
							}}
						/>
						<InputLabel
							style={{
								marginBottom: '10px',
								textAlign: 'end',
								alignSelf: 'flex-end',
								color: charsLeft <= 20 ? 'red' : 'auto',
							}}
							htmlFor='textarea-input'
							className={classes.selectLabel}
						>
							Chars left: {charsLeft}
						</InputLabel>
					</div>
					{user.img.length ? (
						<Button
							color='danger'
							onClick={() =>
								Router.push(
									`/welcome?slug=4`,
									`/welcome/profile/preferences`,
									{ shallow: true },
									{ scroll: false }
								)}
						>
							Next
						</Button>
					) : null}
					<Tooltip title='You can edit these later in your profile page.'>
						<Button
							size='sm'
							simple
							className={classes.skipButton}
							onClick={() =>
								Router.push(
									`/welcome?slug=4`,
									`/welcome/profile/preferences`,
									{ shallow: true },
									{ scroll: false }
								)}
						>
							Skip For Now
						</Button>
					</Tooltip>
				</div>
			)}
		</Mutation>
	);
};

export default withStyles(styles)(MoreInfo);
