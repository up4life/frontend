import React, { useState } from 'react'
import { withApollo, Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import NProgress from 'nprogress'
import Router, { withRouter } from 'next/router'
import Slider from 'react-slick'
import { adopt } from 'react-adopt'

//MUI
import withStyles from '@material-ui/core/styles/withStyles'
import { DialogTitle, Dialog, DialogContent, IconButton, Tooltip } from '@material-ui/core'
import { Close, Favorite, FavoriteBorder, MoreHoriz } from '@material-ui/icons'
//Q&M

import { USER_QUERY } from '../Queries/OtherUser'
import { GET_CONVERSATION_QUERY } from '../Queries/getConvo'
import {
  LIKE_USER_MUTATION,
  UNLIKE_USER_MUTATION,
  UPDATE_BLOCKS_MUTATION
} from '../Mutations/updateUser'

//Components
import Chat from './Chat'
import Transition from '../Transistion'
import CommonEvents from './CommonEvents'
import CommonInterests from './CommonInterests'
//StyledComponents
import Button from '../../styledComponents/CustomButtons/Button'
import GridContainer from '../../styledComponents/Grid/GridContainer'
import GridItem from '../../styledComponents/Grid/GridItem'
import CustomDropdown from '../../styledComponents/CustomDropdown/CustomDropdown.jsx'
//styles
import styles from '../../static/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.jsx'

import ReportUser from './ReportUser'

//utils
import getAge from '../../utils/getAge'

import Fire from '../../static/icons/Fire.js'

let settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
}

const Composed = adopt({
  potentialMatch: ({ id, render }) => (
    <Query query={USER_QUERY} variables={{ id }}>
      {render}
    </Query>
  ),

  like: ({ id, render }) => (
    <Mutation
      mutation={LIKE_USER_MUTATION}
      variables={{ like: id }}
      onCompleted={() => NProgress.done()}
      onError={() => NProgress.done()}
    >
      {render}
    </Mutation>
  ),
  unlike: ({ id, render }) => (
    <Mutation
      mutation={UNLIKE_USER_MUTATION}
      variables={{ like: id }}
      onCompleted={() => NProgress.done()}
      onError={() => NProgress.done()}
    >
      {render}
    </Mutation>
  ),
  block: ({ id, render }) => (
    <Mutation
      mutation={UPDATE_BLOCKS_MUTATION}
      variables={{ block: id }}
      onCompleted={() => {
        NProgress.done()
        Router.push(router.pathname, router.pathname, { shallow: true }, { scroll: false })
      }}
      onError={() => NProgress.done()}
    >
      {render}
    </Mutation>
  )
})

const UserModal = ({ classes, user, router, currentUser }) => {
  currentUser.verified = true
  console.log(currentUser)
  const [reportUser, handleReport] = useState(false)
  return (
    <Composed id={user}>
      {({ like, unlike, block, potentialMatch }) => {
        let match = potentialMatch.data ? potentialMatch.data.user : null
        let isLiked = currentUser ? currentUser.liked.find(usr => usr.id === user) : false
        let userImgs = match ? match.img.sort((a, b) => (a.default ? -1 : b.default ? 1 : 0)) : []
        if (!match) return <div />
        else {
          NProgress.done()
          return (
            <Dialog
              classes={{
                root: classes.modalRoot
              }}
              open={user ? true : false}
              maxWidth="md"
              TransitionComponent={Transition}
              scroll="body"
              onClose={() =>
                Router.push(
                  {
                    pathname: router.pathname,
                    query: { slug: router.query.slug }
                  },
                  `${router.pathname}/${router.query.slug}`,
                  { shallow: true },
                  { scroll: false }
                )
              }
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
            >
              <svg
                style={{ width: 0, height: 0, position: 'absolute' }}
                aria-hidden="true"
                focusable="false"
              >
                <linearGradient id="favoriteID" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF8A8A" />
                  <stop offset="50%" stopColor="#FF545F" />
                  <stop offset="100%" stopColor="#ff101f" />
                </linearGradient>
              </svg>
              <DialogTitle
                id="notice-modal-slide-title"
                disableTypography
                className={`${classes.modalHeader} ${classes.userModalHeader}`}
              >
                <Button
                  simple="true"
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  onClick={e => {
                    e.stopPropagation()
                    Router.push(
                      {
                        pathname: router.pathname,
                        query: { slug: router.query.slug }
                      },
                      router.query.slug
                        ? `${router.pathname}/${router.query.slug}`
                        : router.pathname,
                      { shallow: true },
                      { scroll: false }
                    )
                  }}
                >
                  <Close style={{ color: '#fafafa' }} className={classes.modalClose} />
                </Button>

                <div
                // style={{
                // 	display: 'flex',
                // 	alignItems: 'center',
                // 	justifyContent: 'space-between',
                // }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 700,
                        color: '#fafafa',
                        marginRight: '10px',
                        fontSize: '40px'
                      }}
                      className={classes.modalTitle}
                    >
                      {match.firstName.toUpperCase()}
                      <span style={{ padding: '0 9px' }}>&#8226;</span>
                      {getAge(match.dob)}
                    </h4>
                    <IconButton
                      className={classes.liked}
                      onClick={() => (isLiked ? unlike() : like())}
                    >
                      {isLiked ? (
                        <Favorite className={classes.userFavorite} />
                      ) : (
                        <FavoriteBorder className={classes.notFavorite} />
                      )}
                    </IconButton>
                    <ReportUser
                      currentUser={currentUser}
                      user={match}
                      open={reportUser}
                      setOpen={handleReport}
                    />

                    {match.score > 6000 ? (
                      <div>
                        <Tooltip
                          style={{ fontSize: '18px' }}
                          title={`${(match.score * 0.01).toFixed()} % match!`}
                          placement="right"
                        >
                          <div
                            className={`${
                              match.score > 9000
                                ? classes.fire90
                                : match.score > 8000
                                ? classes.fire80
                                : classes.fire60
                            }`}
                          >
                            <Fire />
                          </div>
                        </Tooltip>
                      </div>
                    ) : null}

                    <CustomDropdown
                      dropPlacement="bottom-end"
                      caret={false}
                      hoverColor="dark"
                      buttonText={<MoreHoriz />}
                      buttonProps={{
                        className:
                          classes.navLink + ' ' + classes.imageDropdownButton + ' ' + classes.dots,
                        style: { marginBottom: 0 },
                        color: 'transparent'
                      }}
                      dropdownList={[`Block ${match.firstName}`, `Report ${match.firstName}`]}
                      onClick={e => (e.includes('Block') ? block() : handleReport(true))}
                    />
                  </div>
                </div>
              </DialogTitle>
              <DialogContent
                style={{
                  zIndex: 3,
                  backgroundColor: '#262323',
                  backgroundImage:
                    'url("https://www.transparenttextures.com/patterns/dark-matter.png")'
                }}
                className={classes.modalBody}
              >
                {/* <div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											height: '100%',
										}}
									> */}
                <GridContainer>
                  <GridItem sm={6} md={6} lg={7} xl={7}>
                    <Slider {...settings} className={classes.slicky}>
                      {userImgs.map(img => (
                        <div key={img.img_url}>
                          <img
                            src={img.img_url}
                            style={{
                              overflow: 'hidden',
                              height: '100%',
                              width: '100%',
                              border: '4px solid #b2ddf7',
                              borderRadius: '6px'
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </GridItem>
                  <GridItem sm={6} md={6} lg={5} xl={5}>
                    <div
                      style={{
                        backgroundColor: '#1b1b1b59',
                        backgroundImage:
                          'url("https://www.transparenttextures.com/patterns/dark-matter.png")',
                        color: '#fafafa',
                        width: '100%'
                      }}
                      className={classes.gradientBox}
                    >
                      {match.biography ? match.biography : 'Hi der This is my lil fill in bio guy'}
                    </div>
                    <CommonInterests match={match} user={currentUser} />
                  </GridItem>
                </GridContainer>
                <GridItem
                  sm={12}
                  md={12}
                  lg={12}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <CommonEvents id={user} />
                </GridItem>
                {/* </GridItem> */}

                <GridItem sm={5} md={12} lg={12}>
                  <Query query={GET_CONVERSATION_QUERY} variables={{ id: user }}>
                    {({ loading, error, data, subscribeToMore, refetch }) => {
                      if (loading) return <div />
                      if (error) return <div>Error</div>
                      return (
                        <Chat
                          data={data}
                          id={user}
                          match={match}
                          currentUser={currentUser}
                          refetch={refetch}
                        />
                      )
                    }}
                  </Query>
                </GridItem>
                {/* </GridContainer> */}
              </DialogContent>
            </Dialog>
          )
        }
      }}
    </Composed>
  )
}

export default withRouter(withApollo(withStyles(styles)(UserModal)))
