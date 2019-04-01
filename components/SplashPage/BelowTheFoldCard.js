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
  const { classes, gif, card, title, text, ...other } = props;

  let cardColor;

  if (card === 'first') {
    cardColor = '#4cb5ae';
  } else if (card === 'second') {
    cardColor = '#ff101f';
  } else {
    cardColor = '#b2ddf7';
  }

  return (
    <Card style={{ border: `3px solid ${cardColor}` }} blog>
      <CardHeader image>
        <a href='#'>
          <img
            style={{ border: `2px solid ${cardColor}` }}
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
          <h6 style={{color: `${cardColor}`, fontSize: '20px'}} className={classes.cardCategory}>{title}</h6>
        </Info>
        <p style={{fontSize: "17px", lineHeight: '1.7', color: '#343434'}}>
        {text}
        </p>
      </CardBody>
    </Card>
  );
}

export default withStyles(style)(BelowTheFoldCard);
