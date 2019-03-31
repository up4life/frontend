import React from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import NProgress from 'nprogress';

import { withRouter } from 'next/router';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { List, ListItem } from '@material-ui/core';
import navbarsStyle from '../../static/jss/material-kit-pro-react/views/componentsSections/navbarsStyle.jsx';
//Q&M

import User from '../Queries/User';
// styled components

import Header from '../../styledComponents/Header/Header.jsx';

import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx';

Router.onRouteChangeComplete = () => {
	NProgress.done(true);
};

const SIGNOUT_MUTATION = gql`
	mutation SIGNOUT_MUTATION {
		signout {
			message
		}
	}
`;

const Nav = ({ classes, color }) => {
	return (
		<User>
			{({ data: { currentUser } }) => {
				return (
					<Header
						color={color}
						fixed={color === 'transparent'}
						changeColorOnScroll={
							color === 'transparent' ? (
								{
									height: 300,
									color: 'warning',
								}
							) : null
						}
						links={
							<List className={classes.list + ' ' + classes.mlAuto}>
								<Mutation mutation={SIGNOUT_MUTATION} onCompleted={() => Router.push('/joinus')}>
									{(signout, { client }) => {
										return (
											<ListItem
												id='button'
												style={{ marginLeft: '10px' }}
												className={classes.listItem}
											>
												<CustomDropdown
													left
													caret={false}
													dropdownHeader={currentUser && currentUser.firstName}
													buttonText={
														<img
															src={currentUser && currentUser.img.find(img => img.default).img_url}
															className={classes.img + ' ' + classes.imageProfile}
															alt='profile'
														/>
													}
													buttonProps={{
														className: classes.navLink + ' ' + classes.imageDropdownButton,
														color: 'transparent',
													}}
													dropdownList={[ 'Profile', 'Sign out' ]}
													onClick={e => {
														if (e === 'Sign out') {
															signout();
															client.clearStore();
														}
														if (e === 'Profile') {
															Router.push('/profile');
														}
													}}
												/>
											</ListItem>
										);
									}}
								</Mutation>
							</List>
						}
					/>
				);
			}}
		</User>
	);
};

export default withRouter(withStyles(navbarsStyle)(Nav));
