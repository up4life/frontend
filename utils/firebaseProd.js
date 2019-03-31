import * as firebase from 'firebase/app';
import 'firebase/auth';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const config = {
	apiKey: publicRuntimeConfig.firebase_key,
	authDomain: publicRuntimeConfig.firebase_domain,
	databaseURL: publicRuntimeConfig.firebase_url,
	projectId: publicRuntimeConfig.firebase_id,
	storageBucket: publicRuntimeConfig.firebase_bucket,
	messagingSenderId: publicRuntimeConfig.firebase_msg_id,
};

export default (!firebase.apps.length ? firebase.initializeApp(config) : firebase.app());
export const auth = firebase.auth();
