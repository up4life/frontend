import React, { useEffect, useState } from 'react'
//MUI
import withStyles from '@material-ui/core/styles/withStyles'
import { Typography } from '@material-ui/core'
//components
import Register from './Register'
import Login from './Login'
import BelowTheFoldCard from './BelowTheFoldCard'
import Footer from '../Footer'
//styled components
import Parallax from '../../styledComponents/Parallax/Parallax'
import GridContainer from '../../styledComponents/Grid/GridContainer'
import GridItem from '../../styledComponents/Grid/GridItem'
import Button from '../../styledComponents/CustomButtons/Button'
//styles
import Styles from '../../static/jss/Splash'
import Logo from '../Header/UpFor'
//gifs and imgs
import eventsGif from '../../static/img/events.gif'
import peopleGif from '../../static/img/people.gif'
import chatGif from '../../static/img/chat.gif'
import arrow from '../../static/img/up4Arrow.png'

const copyArray = [
  {
    title: 'Events',
    text:
      "Live music, theater, sports — whatever you like to do just tell us what it is and we'll tell you where to find it.  There are a million stories in the city.  Find yours."
  },
  {
    title: 'People',
    text:
      "Maybe you're just looking for new friends, maybe you're looking for something more.  Whatever it is tell us who you want to meet and we'll help connect you with people that want to meet you too."
  },
  {
    title: 'Reach Out',
    text:
      'Keep in touch with your new connections on our chat.  Get notified the instant you revieve a new message and plan your rendezvous in real time.'
  }
]

const Splash = ({ classes }) => {
  const [registerShowing, setRegisterShowing] = useState(false)
  const [loginShowing, setLoginShowing] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div>
      <Parallax>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              container
              justify="center"
              alignItems="center"
              direction="column"
              xs={12}
              sm={8}
              md={12}
            >
              <Logo main="true" />

              <div className={classes.tagline}>
                <Typography color="inherit" variant="h2">
                  Meet People. Go Places.
                </Typography>
              </div>
              <div>
                <GridContainer className={classes.centerGrid}>
                  <Button
                    className={classes.registerButton}
                    color="danger"
                    size="lg"
                    onClick={() => setRegisterShowing(true)}
                  >
                    Sign Up
                  </Button>

                  <Button color="info" onClick={() => setLoginShowing(true)}>
                    Log In
                  </Button>
                </GridContainer>
              </div>
            </GridItem>
            <Register showing={registerShowing} setShowing={setRegisterShowing} />
            <Login showing={loginShowing} setShowing={setLoginShowing} />
          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.belowTheFold}>
        <div className={`${classes.main} ${classes.mainRaised} ${classes.mainAddendum}`}>
          <GridContainer
            justify="center"
            style={{ paddingBottom: '100px' }}
            className={classes.container}
          >
            <img src={arrow} />
            <GridContainer
              className={classes.foldBox}
              style={{ border: '2px solid #4cb5ae' }}
              alignItems="center"
            >
              <GridItem xs={12} sm={6}>
                <Typography
                  className={classes.greenGradient}
                  style={{
                    color: '#fafafa',
                    padding: '20px',
                    borderRadius: '6px',
                    textAlign: 'right'
                  }}
                  variant="h3"
                >
                  Somewhere
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={6}>
                <BelowTheFoldCard
                  title={copyArray[0].title}
                  text={copyArray[0].text}
                  card="first"
                  gif={eventsGif}
                />
              </GridItem>
            </GridContainer>
            <GridContainer
              className={classes.foldBox}
              style={{ border: '2px solid #ff101f' }}
              alignItems="center"
            >
              <GridItem xs={12} sm={6}>
                <BelowTheFoldCard
                  title={copyArray[1].title}
                  text={copyArray[1].text}
                  card="second"
                  gif={peopleGif}
                />
              </GridItem>
              <GridItem xs={12} sm={6}>
                <Typography
                  className={classes.redGradient}
                  style={{
                    color: '#fafafa',
                    backgroundColor: '#ff101f',
                    padding: '20px',
                    borderRadius: '6px'
                  }}
                  variant="h3"
                >
                  Someone
                </Typography>
              </GridItem>
            </GridContainer>
            <GridContainer
              className={classes.foldBox}
              style={{ border: '2px solid #b2ddf7' }}
              alignItems="center"
            >
              <GridItem xs={12} sm={6}>
                <Typography
                  className={classes.blueGradient}
                  style={{
                    color: '#fafafa',
                    padding: '20px',
                    borderRadius: '6px',
                    textAlign: 'right'
                  }}
                  variant="h3"
                >
                  Some Night
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={6}>
                <BelowTheFoldCard
                  title={copyArray[2].title}
                  text={copyArray[2].text}
                  card="third"
                  gif={chatGif}
                />
              </GridItem>
            </GridContainer>
          </GridContainer>
        </div>
        <Footer splash />
      </div>
    </div>
  )
}

export default withStyles(Styles)(Splash)
