import React, { useState } from 'react';
import Router, { Link } from 'next/router';
import NProgress from 'nprogress';
import Downshift from 'downshift';
import { Paper, MenuItem } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core';

import GridContainer from '../../styledComponents/Grid/GridContainer';
import GridItem from '../../styledComponents/Grid/GridItem';
import styles from '../../static/jss/Welcome/welcomeStyles';
import Input from '../../styledComponents/CustomInput/CustomInput';
import { UPDATE_USER_MUTATION } from '../Mutations/updateUser';
import { LOCATION_SUGGESTION_QUERY } from '../Queries/LocationSuggestion';
import Button from '../../styledComponents/CustomButtons/Button';

const Gender = ({ user, classes }) => {
	const [ gender, setGender ] = useState(undefined);
	const [ location, setLocation ] = useState('');
	const [ items, setItems ] = useState([]);

	const handleLocationChange = selectedItem => {
		setLocation(selectedItem.slice(0, -5));
	};

	return (
		<Mutation
			mutation={UPDATE_USER_MUTATION}
			variables={{ gender, location }}
			onCompleted={() => {
				NProgress.done();
				Router.push(
					`/welcome?slug=2`,
					`/welcome/profile/age`,
					{ shallow: true },
					{ scroll: false }
				);
			}}
		>
			{(updateUser, { client }) => (
				<div className={classes.innerWrapper} style={{ padding: '90px' }}>
					<h2>I am a...</h2>
					<GridContainer>
						<GridItem md={4} lg={4}>
							<Button
								color='danger'
								className={classes.genderBtn}
								onClick={() => setGender('MALE')}
								simple={gender !== 'MALE'}
							>
								Man
							</Button>
						</GridItem>
						<GridItem md={4} lg={4}>
							<Button
								color='danger'
								className={classes.genderBtn}
								onClick={() => setGender('FEMALE')}
								simple={gender !== 'FEMALE'}
							>
								Woman
							</Button>
						</GridItem>
						<GridItem md={4} lg={4}>
							<Button
								color='danger'
								className={classes.genderBtn}
								onClick={() => setGender('OTHER')}
								simple={gender !== 'OTHER'}
							>
								Non-Binary
							</Button>
						</GridItem>
					</GridContainer>
					<h2>in...</h2>
					<Downshift
						inputValue={location}
						onChange={handleLocationChange}
						onInputValueChange={async e => {
							setLocation(e);
							const { data } = await client.query({
								query: LOCATION_SUGGESTION_QUERY,
								variables: { city: e },
							});

							setItems(data.locationSearch);
						}}
					>
						{({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
							<div className={classes.downshiftContainer}>
								<Input
									white
									inputProps={{
										placeholder: 'Search for a city name...',
										...getInputProps(),
									}}
									formControlProps={{
										style: {
											paddingTop: '12px',
											width: '100%',
											style: { color: '#fafafa' },
										},
									}}
								/>

								{isOpen ? (
									<Paper className={classes.downshiftPaper}>
										{items.map((result, index) => {
											return (
												<MenuItem
													key={index}
													style={{
														backgroundColor: highlightedIndex === index ? '#4cb5ae' : '#fafafa',
														color: highlightedIndex === index ? '#fafafa' : '#3C4858',
													}}
													{...getItemProps({
														item: result.city,
													})}
												>
													{result.city}
												</MenuItem>
											);
										})}
									</Paper>
								) : null}
							</div>
						)}
					</Downshift>
					<Button
						color='danger'
						style={{ zIndex: 1 }}
						disabled={!gender || !location}
						onClick={() => {
							NProgress.start();
							updateUser();
						}}
					>
						Next
					</Button>
				</div>
			)}
		</Mutation>
	);
};

export default withStyles(styles)(Gender);
