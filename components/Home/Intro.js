export default [
  {
    target: 'body',
    content: "This is your events page.  Here you can see what's happening near you.",
    title: 'Welcome to Up4!',
    placement: 'center'
  },
  {
    target: '#filters',
    content: 'This menu lets you filter events by category, date, or location.'
  },
  {
    target: '#likeButton',
    content: "The Up4 button tells others that you're interested in this event."
  },

  {
    target: '#users',
    content:
      "Here you'll see users interested in the event who meet your criteria but only if you also meet their criteria."
  },
  {
    target: '#flip',
    content: 'The flipside of the card gives us more info about them.'
  },
  {
    target: '#chatBubble',
    content: 'The chat pane is a quick way to check up on your messages.'
  },
//   {
//     target: '#button',
//     content: 'Here you can go to your profile to update your settings or check your messages'
//   },
  {
    target: '#home',
    content: 'And the Up4 logo returns you here!'
  },
  {
    target: '#body',
    placement: 'center',
    content:
      "Let your matches know what you're up for or take the first step and message somebody.  Have fun!"
  }
];
