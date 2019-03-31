import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';

import { USER_QUERY, SHARED_EVENTS_QUERY } from '../Queries/OtherUser';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from '../../styledComponents/Card/Card';
import CardHeader from '../../styledComponents/Card/CardHeader';
import CardFooter from '../../styledComponents/Card/CardFooter';
import CardBody from '../../styledComponents/Card/CardBody';
import GridItem from '../../styledComponents/Grid/GridItem';
import GridContainer from '../../styledComponents/Grid/GridContainer';
import Button from '../../styledComponents/CustomButtons/Button.jsx';
//styles
import CardStyles from '../../static/jss/material-kit-pro-react/views/componentsSections/sectionCards';

const CommonEvents = ({ classes, id }) => {
	const { data } = useQuery(SHARED_EVENTS_QUERY, { variables: { id } });
	if (!data.getSharedEvents) return <div>loading</div>;
	return (
		<Fragment>
			{data.getSharedEvents.length ? (
				<GridContainer
					style={{
						maxHeight: '55%',
						overflowX: 'auto',
						margin: '10px 0',
						flexWrap: 'nowrap',
					}}
				>
					{data.getSharedEvents.map(event => (
						<GridItem md={4} lg={4}>
							<Card
								background
								style={{
									position: 'relative',
									border: '4px solid #4cb5ae',
									borderRadius: '11px',
									backgroundImage: `url(${event.image_url})`,
									marginTop: '0',
									marginBottom: '10px',
									minWidth: '200px',
									//marginBottom: '',
								}}
							>
								<CardBody
									background
									style={{
										maxWidth: '100%',
										padding: '10px',
										display: 'flex',
										alignItems: 'center',
										minHeight: '150px',
									}}
								>
									{' '}
									<h4 className={classes.cardTitleWhite}>{event.title}</h4>
								</CardBody>
							</Card>
						</GridItem>
					))}
				</GridContainer>
			) : (
				<div>No shared events!</div>
			)}
			{/* </GridContainer> */}
		</Fragment>
	);
};

export default withStyles(CardStyles)(CommonEvents);
