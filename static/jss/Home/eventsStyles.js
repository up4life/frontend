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
};

export default styles;
