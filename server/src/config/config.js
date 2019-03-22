module.exports =  {
    port: 8080,
    database: {
        url: 'mongodb://localhost:27017/testDB',
        user: 'antiadmin',
        password: 'antipassword'
    },
    auth: {
        secret: 'secret'
    }
};