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
            getName: (user) => {
                const name = `${user.FirstName} ${user.SecondName} ${user.LastName}`.trim();
                if(name) return name;
                else return user.Mail.split('@')[0];
            }
        }
    }
});
