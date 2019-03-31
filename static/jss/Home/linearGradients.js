export default function() {
	return (
		<div>
			<svg
				style={{ width: 0, height: 0, position: 'absolute' }}
				aria-hidden='true'
				focusable='false'
			>
				<linearGradient id='favoriteID' x2='1' y2='1'>
					<stop offset='0%' stopColor='#FF8A8A' />
					<stop offset='50%' stopColor='#FF545F' />
					<stop offset='100%' stopColor='#ff101f' />
				</linearGradient>
			</svg>
			<svg
				style={{ width: 0, height: 0, position: 'absolute' }}
				aria-hidden='true'
				focusable='false'
			>
				<linearGradient id='chatID' x2='1' y2='1'>
					<stop offset='0%' stopColor='#81d6e3' />
					<stop offset='50%' stopColor='#15C0DA' />
					<stop offset='100%' stopColor='#81d6e3' />
				</linearGradient>
			</svg>
		</div>
	);
}
