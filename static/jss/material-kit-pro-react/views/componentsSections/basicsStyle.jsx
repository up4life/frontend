import { container, title, mlAuto, mrAuto } from '../../../material-kit-pro-react';
import customCheckboxRadioSwitch from '../../../material-kit-pro-react/customCheckboxRadioSwitchStyle';
import customSelectStyle from '../../../material-kit-pro-react/customSelectStyle';
import chipStyles from '../../../chipStyles';
import inputRangeStyles from '../../../inputRangeStyles';

const drawerWidth = 'auto';

const basicsStyle = theme => ({
	mlAuto,
	mrAuto,
	container,
	...customSelectStyle,
	...customCheckboxRadioSwitch,
	...chipStyles,
	...inputRangeStyles,
	sections: {
		padding: '70px 0',
	},
	title: {
		...title,
		marginTop: '10px',
		minHeight: '32px',
		textDecoration: 'none',
		color: '#fafafa',
	},
	space50: {
		height: '50px',
		display: 'block',
	},
	space70: {
		height: '70px',
		display: 'block',
	},
	icons: {
		width: '17px',
		height: '17px',
		color: '#FFFFFF',
	},

	//Appended styles from docs
	selectLabel: {
		...customSelectStyle.selectLabel,
		color: '#fafafa',
	},
	select: {
		...customSelectStyle.select,
		color: '#fafafa',
	},

	root: {
		display: 'flex',
	},
	appBar: {
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 20,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		// padding: 10,
		paddingTop: '100px',
		zIndex: 1000,
		backgroundColor: '#2d2d2d80',

		'& svg': {
			color: '#fafafa',
		},
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},

	paper: {
		background: 'transparent',
		border: '2px solid #4cb5ae',
		display: 'flex',
		flexDirection: 'column',
		padding: '20px',
		backgroundColor: 'rgba(0,0,0,0.32)',
		'& ::before': {
			borderBottom: '1px solid #fafafa',
		},
		'& svg': {
			fill: '#fafafa',
		},
		// backgroundImage:
		//   "url(https://www.transparenttextures.com/patterns/dark-matter.png)"
	},
	paper2: {
		background: 'transparent',
		border: '2px solid #b2ddf7',
		display: 'flex',
		flexDirection: 'column',
		padding: '20px',
		backgroundColor: 'rgba(0,0,0,0.32)',
		'& ::before': {
			borderBottom: '1px solid #fafafa',
		},
		'& svg': {
			fill: '#fafafa',
		},
	},
	darkBackground: {
		background: 'transparent',
		color: '#fafafa',
	},
	interests: {
		height: '40%',
		border: '4px solid #b2ddf7',
		borderRadius: '6px',
		padding: '10px',
		'& span': {
			color: '#fafafa',
		},
		'& svg': {
			color: '#fafafa',
		},
	},
	bigChip: {
		fontSize: '14px',
	},
	profileDrawer: {
		'& svg': {
			transition: 'all .4s',
			'&:hover': {
				fill: '#df9bbe',
			},
		},
	},
});

export default basicsStyle;
