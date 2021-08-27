const authconfig = {
	token_secret: process.env.JWT_TOKEN_SECRET || 'TOKEN_SECRET',
	token_life: 3600,
	refresh_token_secret:
		process.env.JWT_REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
	refresh_token_life: 604800,
};

export default authconfig;
