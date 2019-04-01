import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { styled } from '@material-ui/styles';
// core components
import Card from '../../styledComponents/Card/Card.jsx';
import CardBody from '../../styledComponents/Card/CardBody.jsx';
import CardHeader from '../../styledComponents/Card/CardHeader.jsx';
import Info from '../../styledComponents/Typography/Info.jsx';

import imagesStyles from '../../static/jss/material-kit-pro-react/imagesStyles';
import cardsStyle from '../../static/jss/material-kit-pro-react/views/componentsSections/sectionCards';

import { cardTitle } from '../../static/jss/material-kit-pro-react';

import eventsGif from '../../static/img/events.gif';
const styledBy = (property, mapping) => props => mapping[props[property]];

const style = {
  ...imagesStyles,
  ...cardsStyle,
  cardTitle
  // root: {
  //   border: styledBy('card', {
  //     first: '2px solid red'
  //   })
  // },
  // border: styledBy('card', {
  //   first: '2px solid red'
  // })
};

function BelowTheFoldCard(props) {
  const { classes, gif, card, ...other } = props;

  let borderColor;

  if (card === 'first') {
    borderColor = '#4cb5ae';
  } else if (card === 'second') {
    borderColor = '#ff101f';
  } else {
    borderColor = '#b2ddf7';
  }

  return (
    <Card style={{ border: `3px solid ${borderColor}` }} blog>
      <CardHeader image>
        <a href='#'>
          <img
            style={{ border: `2px solid ${borderColor}` }}
            className={classes.imgCard}
            src={gif}
            alt=''
          />
          {/* <div className={classes.imgCardOverlay}>
            <h4
              className={classes.cardTitle}
              style={{
                color: 'white',
                position: 'absolute',
                bottom: '10px',
                left: '15px'
              }}
            >
              This Summer Will be Awesome
            </h4>
          </div> */}
        </a>
      </CardHeader>
      <CardBody>
        <Info>
          <h6 className={classes.cardCategory}>Fashion</h6>
        </Info>
        <p>
          Don't be scared of the truth because we need to restart the human foundation in truth And
          I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
        </p>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(BelowTheFoldCard);
