import moment from 'moment';

export default function(date) {
	let diff = moment().diff(date, 'days');
	if (diff === 0) {
		return moment(date).format('h:mm a');
	} else if (diff === 1) {
		return 'Yesterday';
	} else if (diff < 7) {
		return moment(date).format('dddd');
	} else {
		return moment(date).format('M/D/YY');
	}
}
