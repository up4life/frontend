import React, { useEffect, useState, createContext } from 'react'
import { Query } from 'react-apollo'
import { ALL_CHATS_QUERY } from './Queries/AllChats'
import User, { CURRENT_USER_QUERY } from './Queries/User'
import { useQuery, useSubscription } from 'react-apollo-hooks'

export const ChatCtx = createContext([undefined, () => {}])

const ConvoContainer = ({ children }) => {
  const [chatId, setChatId] = useState(undefined)
  const { data } = useQuery(ALL_CHATS_QUERY)

  const formatted = (userChats, currentUser) => {
    if (userChats) {
      return userChats
        .filter(msg => msg.messages)
        .map(chatObj => {
          let newMsgs = chatObj.messages.filter(msg => msg.from.id !== currentUser.id && !msg.seen)
          let len = chatObj.messages.length - 1
          const { messages, users } = chatObj
          let [usr] = users.filter(usr => usr.id !== currentUser.id)
          let img = usr.img.length ? usr.img.find(img => img.default).img_url : profileStandIn

          return {
            id: chatObj.id,
            from: usr.firstName,
            fromId: usr.id,
            text: messages[len].text,
            img: img,
            time: messages[len].createdAt,
            newMsgs: newMsgs.length,
            typing: chatObj.typing.map(user => user.firstName)
          }
        })
        .sort((a, b) => {
          let dateA = new Date(a.time)
          let dateB = new Date(b.time)
          return dateB - dateA
        })
    } else return undefined
  }

  const selectedChat = !data.getUserChats
    ? null
    : data.getUserChats.find(chat => chat.id === chatId)

  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data: { currentUser } }) => {
        const formattedChats = formatted(data.getUserChats, currentUser)
        return (
          <ChatCtx.Provider
            value={{
              chatId,
              setChat: setChatId,
              chat: selectedChat,
              currentUser,
              formattedChats,
              data
            }}
          >
            {children}
          </ChatCtx.Provider>
        )
      }}
    </Query>
  )
}

export default ConvoContainer
