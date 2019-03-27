import { container } from '../material-kit-pro-react';
import customSelectStyle from '../material-kit-pro-react/customSelectStyle';
import chipStyles from '../chipStyles';
import inputRangeStyles from '../inputRangeStyles';
// import { url } from "inspector";
const styles = {
	container,
	...customSelectStyle,
	...chipStyles,
	...inputRangeStyles,
	pageHeader: {
		minHeight: '100vh',
		height: 'auto',
		display: 'inherit',
		position: 'relative',
		margin: '0',
		padding: '0',
		border: '0',
		alignItems: 'center',
		'&:before': {
			// background: 'rgba(0, 0, 0, 0.5)',
		},
		'&:after': {
			// background: 'linear-gradient(60deg,rgba(76,181,174, 0.7),rgba(76,181,174, 0.9))',
		},
		// '&:before,&:after': {
		// 	position: 'absolute',
		// 	// zIndex: '1',
		// 	width: '100%',
		// 	height: '100%',
		// 	display: 'block',
		// 	left: '0',
		// 	top: '0',
		// 	content: '""',
		// },
	},
	selectLabel: {
		...customSelectStyle.selectLabel,
		color: '#fafafa',
	},
	stepper: {
		backgroundColor: 'transparent',
	},
	step: {
		color: 'transparent !important',
		'& text': {
			fill: '#fafafa !important',
		},
	},
	active: {
		color: '#ff101f !important',
	},
	completed: {
		color: '#da6068 !important',
	},
	textArea: {},
	verifyInput: {
		display: 'flex',
		flexDirection: 'column',
		'& ::after': {
			borderBottomColor: '#15c0da',
		},
		'& input': {
			color: '#fafafa',
		},
	},
	proIcon: {
		width: '100px',
		height: '100px',
	},
	downshiftContainer: {
		width: '100%',
	},
	downshiftPaper: {
		position: 'absolute',
		zIndex: 2,
		maxWidth: '310px',
		width: '100%',
	},
	favorite: {
		width: '100px',
		height: '100px',
		fill: 'url(#favoriteID) #ff101f',
	},
	chat: {
		width: '100px',
		height: '100px',
		fill: 'url(#chatID) #15C0DA',
	},
	event: {
		width: '100px',
		height: '100px',
		fill: 'url(#eventID) #B661AB',
	},
	receipt: {
		width: '100px',
		height: '100px',
		fill: 'url(#receiptID) #4CB5AE',
	},
	proButton: {
		backgroundImage: 'linear-gradient(to right, #f6655a, #f9574c, #fc473e, #fe332f, #ff101f)',
	},
	mobileStepper: {
		background: 'transparent',
		display: 'flex',
		justifyContent: 'center',
	},
	dots: {
		display: 'flex',
	},
	dot: {
		margin: '0 6px',
	},
	dotActive: {
		backgroundColor: '#ff101f',
	},
	pageWrapper: {
		height: '100%',
		width: '100%',
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1,
	},
	innerWrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgb(0,0,0,.6)',
		padding: '40px',
		//   border: '2px solid #ff101f',
		borderRadius: '6px',
		'& textarea': {
			color: '#fafafa',
		},
		'& ::after': {
			borderBottomColor: '#ff101f',
		},
	},
	center: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
};

export default styles;
