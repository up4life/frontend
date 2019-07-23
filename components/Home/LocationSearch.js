import React, { useState, useEffect, useRef } from 'react'
import Downshift from 'downshift'
import { ApolloConsumer } from 'react-apollo'
//MUI
import { Paper, MenuItem } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
//Q&M
import { LOCATION_SUGGESTION_QUERY } from '../Queries/LocationSuggestion'
//styled components
import Input from '../../styledComponents/CustomInput/CustomInput'
import Button from '../../styledComponents/CustomButtons/Button'

const Search = props => {
  let { setLocation } = props

  const [input, setInput] = useState('')
  const [items, setItems] = useState([])
  const onChange = selectedItem => {
    setInput(selectedItem)
  }

  return (
    <ApolloConsumer>
      {client => (
        <Downshift
          inputValue={input}
          onChange={onChange}
          onInputValueChange={async e => {
            setInput(e)
            const { data } = await client.query({
              query: LOCATION_SUGGESTION_QUERY,
              variables: { city: e }
            })

            setItems(data.locationSearch)
          }}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,

            highlightedIndex,
            selectedItem
          }) => (
            <div>
              <Input
                inputProps={{
                  placeholder: 'Search for a city name...',
                  ...getInputProps()
                }}
                formControlProps={{
                  style: { paddingTop: '12px', width: '78%' }
                }}
              />
              <Button
                justIcon
                round="true"
                disabled={!selectedItem}
                onClick={() => {
                  let city = input.slice(0, -5)

                  setLocation(city)
                }}
              >
                <SearchIcon />
              </Button>

              {isOpen ? (
                <Paper
                  style={{
                    position: 'absolute',
                    zIndex: 2,

                    width: '200px',
                    background: '#3c3c3c'
                  }}
                  {...getMenuProps()}
                >
                  {items.map((result, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={{
                          backgroundColor: highlightedIndex === index ? '#81d6e3' : '#3c3c3c'
                        }}
                        {...getItemProps({ item: result.city, index, key: index })}
                      >
                        {result.city}
                      </MenuItem>
                    )
                  })}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      )}
    </ApolloConsumer>
  )
}

export default Search
