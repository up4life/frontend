import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

import { Badge } from '@material-ui/core'
import styles from '../../../static/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.jsx'
import date from '../../../utils/formatDate'

const Chat = ({ chat, setChat, selectedChat, classes }) => {
  const isSelected = selectedChat ? chat.id === selectedChat.id : false
  return (
    <div
      onClick={() => setChat(chat.id)}
      className={classes.slidinUser}
      style={{
        display: 'flex',
        marginBottom: '20px',
        padding: isSelected ? '10px 15px' : '12px 17px',
        borderRadius: '2px',
        border: isSelected ? '1px solid #4cb5ae' : 'none',
        backgroundColor: isSelected ? '#373737' : '#1f1e1e',
        backgroundImage: isSelected
          ? 'url(https://www.transparenttextures.com/patterns/dark-fish-skin.png)'
          : 'none'
      }}
    >
      <Badge badgeContent={chat.newMsgs} color="error">
        <img
          src={chat.img}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '6px'
          }}
        />
      </Badge>
      <div
        style={{
          marginLeft: '15px',
          wordBreak: 'break-word',
          width: '200px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4 style={{ margin: '0', color: '#fafafa' }} className={classes.title}>
            {chat.from}
          </h4>
          <small>{date(chat.time)}</small>
        </div>
        <p
          style={{
            maxHeight: '50px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#fafafa'
          }}
        >
          {`${chat.text}${chat.typing.includes(chat.from) ? '- is typing ...' : ''}`}
        </p>
      </div>
    </div>
  )
}

export default withStyles(styles)(Chat)
