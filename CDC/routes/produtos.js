module.exports = (app) => {


    app.get('/produtos', (req, res) => {

        const mysql = require('mysql');

        // console.log(mysql);

        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cdc_project'
        });

        console.log(conn);

        conn.query('SELECT * FROM livros', () => {
            console.log(arguments);
        });

        res.render('produtos/lista');
    })
}