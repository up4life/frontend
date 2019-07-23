import React, { useState } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import { Mutation } from 'react-apollo'
import InputRange from 'react-input-range'
import { withStyles, Tooltip } from '@material-ui/core'

import { UPDATE_USER_MUTATION } from '../Mutations/updateUser'

import styles from '../../static/jss/Welcome/welcomeStyles'

import Button from '../../styledComponents/CustomButtons/Button'

const GenderPrefs = ({ classes }) => {
  const [genderPrefs, setGenderPrefs] = useState([])
  const [agePref, setAgePref] = useState({
    min: 18,
    max: 50
  })

  const handleSetGender = pref => {
    if (genderPrefs.find(x => x === pref)) {
      setGenderPrefs(genderPrefs.filter(x => x !== pref))
    } else {
      setGenderPrefs([...genderPrefs, pref])
    }
  }

  return (
    <Mutation
      mutation={UPDATE_USER_MUTATION}
      variables={{
        genderPrefs,
        minAgePref: agePref.min,
        maxAgePref: agePref.max
      }}
      onCompleted={() => {
        NProgress.done()
        Router.push(
          `/welcome?slug=5`,
          `/welcome/profile/interests`,
          { shallow: true },
          { scroll: false }
        )
      }}
    >
      {updateUser => (
        <div className={classes.innerWrapper} style={{ position: 'relative' }}>
          <h2>I would like to meet...</h2>
          <Button
            color="danger"
            genderPrefs
            simple={!genderPrefs.find(x => x === 'MALE')}
            onClick={() => handleSetGender('MALE')}
          >
            Men
          </Button>
          <Button
            color="danger"
            genderPrefs
            simple={!genderPrefs.find(x => x === 'FEMALE')}
            onClick={() => handleSetGender('FEMALE')}
          >
            Women
          </Button>
          <Button
            color="danger"
            genderPrefs
            simple={!genderPrefs.find(x => x === 'OTHER')}
            onClick={() => handleSetGender('OTHER')}
          >
            Non-Binary
          </Button>
          <h2 style={{ marginBottom: '20px' }}>between the ages of...</h2>
          <div className={classes.inputRange} style={{ width: '100%' }}>
            <InputRange
              minLabel="range-label"
              maxLabel="range-label"
              maxValue={80}
              minValue={18}
              value={agePref}
              onChange={value => setAgePref(value)}
            />
          </div>
          <Button
            color="danger"
            style={{ zIndex: 1 }}
            disabled={!genderPrefs.length}
            onClick={() => {
              NProgress.start()
              updateUser()
            }}
          >
            Next
          </Button>
          <Tooltip title="You can edit these later in your profile page.">
            <Button
              size="sm"
              simple
              className={classes.skipButton}
              onClick={() =>
                Router.push(
                  `/welcome?slug=5`,
                  `/welcome/profile/interests`,
                  { shallow: true },
                  { scroll: false }
                )
              }
            >
              Skip For Now
            </Button>
          </Tooltip>
        </div>
      )}
    </Mutation>
  )
}

export default withStyles(styles)(GenderPrefs)
