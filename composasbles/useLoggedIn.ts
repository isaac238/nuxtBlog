export default function() {
	return useState<boolean>('loggedIn', () => false);
}
