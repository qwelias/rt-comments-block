module.exports = Object.freeze({
    root: __dirname,
    PORT: process.env.PORT || 4998,
    session: {
    	secret: 'doctor secret',
    	key: 'doctor.sid',
    	cookie: {
    		path: '/',
    		httpOnly: true,
            domain: process.env.DOMAIN || '.doctor.jt.jetstyle.ru',
    		maxAge: 24*60*60*1000
    	},
    	maxAge: 24*60*60*1000,
    	secure: true,
    	store: null,
    	saveUninitialized: false,
    	resave: false
    },
    db:{
        url:'mongodb://localhost/doctor_dev',
        user:{
            model: 'user',
            fields: [ // optional, I think
                'FirstName',
                'SecondName',
                'Photo',
                'LastName',
                'Mail'
            ],
            process: (user) => {
                if(!user) return {
					name: "<удалён>",
					photo: ''
				};
                const name = `${user.FirstName} ${user.SecondName} ${user.LastName}`.trim();
                return {
                    name: name || user.Mail.split('@')[0],
                    photo: user.Photo
                };
            },
            getID: function(session){
                return session && session.passport && session.passport[this.model];
            }
        }
    }
});
