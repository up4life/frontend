import {
  container,
  mlAuto,
  mrAuto,
  cardTitle,
  description,
  main,
  mainRaised
} from '../material-kit-pro-react';
import modalStyle from '../material-kit-pro-react/modalStyle';

const styles = theme => {
  return {
    ...modalStyle(theme),
    container,
    cardTitle,
    description,
    mlAuto,
    mrAuto,
    main,
    mainRaised,
    registerButton: {
      backgroundImage: 'linear-gradient(to right, #f6655a, #f9574c, #fc473e, #fe332f, #ff101f)',
      fontSize: [['30px'], '!important']
    },
    tagline: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: '17px',
      borderRadius: '20px',
      margin: '10px auto',
      color: '#fafafa',
      textAlign: 'center'
    },
    centerGrid: {
      flexDirection: 'column',
      alignItems: 'center'
    },

    register: {
      backgroundColor: '#262323',
      backgroundImage: 'url("https://www.transparenttextures.com/theme/images/transparent.png")',
      color: '#fafafa',
      border: '2px solid #81d6e3',
      '& h3': {
        color: '#fafafa'
      },
      '& h4': {
        color: '#fafafa'
      },
      '& input': {
        color: '#fafafa',
        height: '19px'
      }
    },

    textCenter: {
      textAlign: 'center'
    },
    loginHeader: {
      backgroundImage:
        'linear-gradient(to right, #81d6e3, #78d5e3, #6ed4e3, #63d2e4, #57d1e4, #4fd0e4, #45cee4, #3acde4, #32cce4, #28cbe5, #1ac9e5, #02c8e6)',
      background: 'transparent'
    },
    cardTitleWhite: {
      ...cardTitle,
      color: '#FFFFFF !important'
    },
    socialLine: {
      marginTop: '1rem',
      textAlign: 'center',
      padding: '0'
    },
    inputAdornment: {
      marginRight: '18px',
      position: 'relative'
    },
    inputAdornmentIcon: {
      color: '#495057'
    },
    socialLineButton: {
      '&, &:hover': { color: '#fff' },
      marginLeft: '5px',
      marginRight: '5px'
    },
    cardLoginBody: {
      paddingTop: '0',
      paddingBottom: '0'
    },
    icon: {
      width: '24px',
      height: '24px',
      color: '#495057'
    },
    infoArea: {
      padding: '0px 0px 20px !important'
    },
    justifyContentCenter: {
      WebkitBoxPack: 'center !important',
      MsFlexPack: 'center !important',
      justifyContent: 'center !important'
    },
    loginButton: {
      backgroundImage:
        'linear-gradient(to right, #81d6e3, #78d5e3, #6ed4e3, #63d2e4, #57d1e4, #4fd0e4, #45cee4, #3acde4, #32cce4, #28cbe5, #1ac9e5, #02c8e6)',
      color: '#fafafa !important'
    },
    section: {
      padding: '70px 0 0'
    },
    resetInput: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'stretch',
      padding: '10px 40px'
    },
    autofillOverride: {
      '& input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus': {
		'-webkit-box-shadow': '0 0 0 30px #262323 inset !important',
		border: 'none !important',
		'-webkit-text-fill-color': '#fafafa !important',
		transition: 'background-color 5000s ease-in-out 0s'
      }
    }
  };
};

export default styles;
