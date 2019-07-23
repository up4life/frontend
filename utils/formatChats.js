export default function(newMessages, user) {
  return newMessages
    .filter(msg => msg.messages)
    .map(chatObj => {
      let len = chatObj.messages.length - 1
      const { messages, users } = chatObj
      let [usr] = users.filter(usr => usr.id !== user.id)
      let newMsgs = messages.filter(msg => !msg.seen && msg.from.id !== user.id)
      let img = usr && usr.img.find(img => img.default).img_url
      return {
        id: chatObj.id,
        from: usr && usr.firstName,
        fromId: usr && usr.id,
        newMsgs: newMsgs.length,
        text: messages[len] ? messages[len].text : null,
        img: img,
        time: messages[len] ? messages[len].createdAt : null
      }
    })
    .sort((a, b) => {
      let dateA = new Date(a.time)
      let dateB = new Date(b.time)
      return dateB - dateA
    })
}
