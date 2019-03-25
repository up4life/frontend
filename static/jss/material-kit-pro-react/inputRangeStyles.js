const styles = {
	inputRange: {
		marginBottom: '13px',
		'& .input-range__slider': {
			appearance: 'none',
			background: '#ff101f',
			border: '1px solid #ff101f',
			borderRadius: '100%',
			cursor: 'pointer',
			display: 'block',
			height: '1rem',
			marginLeft: '-0.5rem',
			marginTop: '-0.65rem',
			outline: 'none',
			position: 'absolute',
			top: '50%',
			transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
			width: '1rem',
		},
		'& .input-range__slider:active': {
			transform: 'scale(1.3)',
		},
		'& .input-range__slider:focus': {
			boxShadow: '0 0 0 5px rgba(63, 81, 181, 0.2)',
		},
		'& .input-range--disabled .input-range__slider': {
			background: '#cccccc',
			border: '1px solid #cccccc',
			boxShadow: 'none',
			transform: 'none',
		},

		'& .input-range__slider-container': {
			transition: 'left 0.3s ease-out',
		},

		'& .input-range__label': {
			color: '#aaaaaa',
			fontFamily: '"Helvetica Neue", san-serif',
			fontSize: '0.8rem',
			transform: 'translateZ(0)',
			whiteSpace: 'nowrap',
		},

		'& .input-range__label--min & .input-range__label--max': {
			bottom: '-1.4rem',
			position: 'absolute',
		},

		// '& .input-range__label--min': {
		// 	left: 0,
		// },

		// '& .input-range__label--max': {
		// 	right: 0,
		// },

		'& .input-range__label--value': {
			position: 'absolute',
			top: '-1.8rem',
		},

		'& .input-range__label-container': {
			left: '-50%',
			position: 'relative',
		},
		'& .input-range__label--max .input-range__label-container': {
			left: '50%',
		},

		'& .input-range__track': {
			background: '#eeeeee',
			borderRadius: '0.3rem',
			cursor: 'pointer',
			display: 'block',
			height: '0.3rem',
			position: 'relative',
			transition: 'left 0.3s ease-out, width 0.3s ease-out',
		},
		'& .input-range--disabled .input-range__track': {
			background: '#eeeeee',
		},

		'& .input-range__track--background': {
			left: 0,
			marginTop: '-0.15rem',
			position: 'absolute',
			right: 0,
			top: '50%',
		},

		'& .input-range__track--active': {
			backgroundImage:
				'linear-gradient(to right, #cabac8, #df9bbe, #f6749d, #ff4768, #ff101f)',
			// background: #ff101f;
		},

		'& .input-range': {
			height: '1rem',
			position: 'relative',
			width: '100%',
		},
		'& .input-range__label--max .input-range__label-container': {
			display: 'none',
		},
		'& .input-range__label--min .input-range__label-container': {
			display: 'none',
		},
	},
};

export default styles;
