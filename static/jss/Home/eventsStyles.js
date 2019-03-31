import { container } from '../material-kit-pro-react';

const styles = {
	container,
	background: {
		paddingTop: '40px',
		height: '100%',
		minHeight: '100vh',
		paddingBottom: '40px',
		backgroundColor: '#000',
		backgroundImage: `url(${require('../../img/shattered-dark.png')})`,
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 20,
		color: 'white',
	},
	hide: {
		opacity: 0,
	},
	transparentButton: {
		backgroundColor: 'transparent !important',
	},
	drawer: {
		padding: '0 20px',
		width: '250px',
	},

	metaDrawer: {
		backgroundColor: '#2e2e2e',
		backgroundImage: `url(${require('../../img/dark-fish-skin.png')})`,
		'& div': {
			backgroundColor: '#2e2e2e',
			backgroundImage: `url(${require('../../img/dark-fish-skin.png')})`,
			borderBottom: 'none !important',
		},
		'& svg': {
			color: '#fafafa',
			borderColor: '#fafafa',
		},
		'& ::after': {
			borderBottomColor: '#b2ddf7',
		},
		'& label': {
			color: '#fafafa !important',
		},
		'& p': {
			color: '#fafafa',
		},
		'& h4': {
			color: '#fafafa',
		},
		'& button': {
			backgroundColor: '#ff101f',
		},
		'& input': {
			color: '#fafafa',
		},
		'& li': {
			color: '#fafafa',
		},
		boxShadow: 'rgb(31, 31, 31) 0px 0px 9px 4px',
	},
	centerButton: {
		display: 'flex',
		justifyContent: 'center',
	},
	fabButton: {
		position: 'absolute',
		bottom: '30px',
		right: '30px',
	},
	chatBadge: {
		zIndex: '10',
		top: '5px',
		right: '10px',
		//backgroundColor: '#ff101f',
	},
	chatIcon: {
		margin: '0 !important',
		width: '25px !important',
		height: '25px !important',
	},
	imageDropdownButton: {
		padding: '0px',
		top: '4px',
		borderRadius: '50%',
		marginLeft: '5px',
	},
	messageDropdown: {
		backgroundColor: 'red',
	},
	newIndicator: {
		backgroundColor: '#ff101f',
		marginRight: '-5px',
		marginLeft: '-3px',
		paddingLeft: '30px',
		paddingTop: '2px',
		borderBottomLeftRadius: '3px',
		borderTopLeftRadius: '3px',
		marginBottom: '10px',
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	respondInput: {
		width: '100%',
		backgroundColor: '#373737',
		border: 'none',
		color: '#fafafa',
		padding: '10px 10px 5px',
	},
	expandedChat: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		marginTop: '20px',
		// borderTop: "2px solid #b2ddf7",
		'& textarea': {
			color: '#fafafa',
		},
		'& ::after': {
			borderBottomColor: '#81d6e3',
		},
		'& button': {
			backgroundImage: 'linear-gradient(to right, #81d6e3, #71d0df, #5ecadb, #49c3d8, #2dbdd4)',
			background: 'transparent',
			borderRadius: '6px',
			marginLeft: '20px',
			// position: 'relative',
			// bottom: '16px'
		},
	},
	textareaAutosize: {
		width: '100%',
		background: 'transparent',
		border: 'none',
		resize: 'none',
		fontSize: '16px',
		userSelect: 'all',
		color: '#fafafa',
		borderBottom: '1px solid gray',
	},
};

export default styles;
