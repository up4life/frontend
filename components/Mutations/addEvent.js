import React from 'react'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const ADD_EVENT_MUTATION = gql`
  mutation ADD_EVENT_MUTATION(
    $tmID: String!
    $title: String!
    $venue: String!
    $image_url: String
    $times: [String]
    $city: String
    $genre: String
    $category: String
  ) {
    addEvent(
      event: {
        tmID: $tmID
        title: $title
        venue: $venue
        image_url: $image_url
        times: $times
        city: $city
        genre: $genre
        category: $category
      }
    ) {
      id
      tmID
      # attending {
      # 	id
      # 	firstName
      # }
    }
  }
`
