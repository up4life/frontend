import { container, title } from '../../../material-kit-pro-react';
import headerLinksStyle from '../../../material-kit-pro-react/components/headerLinksStyle';

const navbarsStyle = theme => ({
	container,
	...headerLinksStyle(theme),
	section: {
		padding: '70px 0',
		paddingBottom: '0',
	},
	title: {
		...title,
		//marginTop: '30px',
		//minHeight: '32px',

		margin: '0',
		marginTop: '2px',
		marginBottom: '0',
		minHeight: 'auto',
		textDecoration: 'none',
	},
	newMsgz: {
		border: '1px solid #ff101f',
		'&:hover': {
			border: '1px solid #ff101f',
		},
	},
	navbar: {
		marginBottom: '-20px',
		zIndex: '100',
		position: 'relative',
		overflow: 'hidden',
		'& header': {
			borderRadius: '0',
			zIndex: 'unset',
		},
	},
	navigation: {
		backgroundPosition: '50%',
		backgroundSize: 'cover',
		marginTop: '0',
		minHeight: '740px',
	},
	formControl: {
		margin: '0 !important',
		paddingTop: '0',
	},
	inputRootCustomClasses: {
		margin: '0!important',
	},
	searchIcon: {
		width: '20px',
		height: '20px',
		color: 'inherit',
	},
	img: {
		width: '60px',
		height: '60px',
		borderRadius: '6px',
		transition: 'all .4s',
		'&:hover': {
			boxShadow: '0 0 1rem rgba(255, 255, 255, 0.61)',
		},
	},
	chatBadge: {
		zIndex: '10',
		backgroundColor: '#ff101f',
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
});

export default navbarsStyle;
