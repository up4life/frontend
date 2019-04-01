import { Util } from 'cloudinary-core';

export const openUploadWidget = callback => {
	const options = {
		cropping: true,
		sources: [ 'local', 'instagram', 'facebook' ],
		multiple: false,
		croppingAspectRatio: 1,
		gravity: 'custom',
		croppingShowBackButton: false,
		cloudName: 'dcwn6afsq',
		uploadPreset: 'upfor4',
	};
	options.styles = {
		palette: {
			window: '#262323',
			sourceBg: '#495057',
			windowBorder: '#CABAC8',
			tabIcon: '#00BA96',
			inactiveTabIcon: '#CABAC8',
			menuIcons: '#4CB5AE',
			link: '#FF101F',
			action: '#FF101F',
			inProgress: '#00BA96',
			complete: '#B2DDF7',
			error: '#c43737',
			textDark: '#262323',
			textLight: '#FAFAFA',
		},
		fonts: {
			"'Fira Sans', sans-serif": 'https://fonts.googleapis.com/css?family=Fira+Sans',
		},
	};
	const scOptions = Util.withSnakeCaseKeys(options);

	window.cloudinary.openUploadWidget(scOptions, callback);
};
