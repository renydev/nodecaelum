module.exports = (app) => {
    app.get('/produtos', (req, res) => {

        const conn = app.infra.connectionFactory();

        const ProdutoDao = app.infra.ProdutoDao;

        let produtoDao = new ProdutoDao(conn);

        produtoDao.lista(function (err, result) {
            // content negociation
            res
            // .header("Access-Controll-Allow-Origin", "*")
            .format({
                html: function() {
                    res.render('produtos/lista', {resultado: result } );
                },
                json: function() {
                    res.json(result);
                }
            });
        });

        conn.end();
    });

    app.get('/produtos/buscar', (req, res) => {
        res.redirect('/produtos');
    })

    app.post('/produtos/buscar', (req, res) => {

        const conn = app.infra.connectionFactory();

        const ProdutoDao = app.infra.ProdutoDao;

        let produtoDao = new ProdutoDao(conn);

        let campo = req.body;

        produtoDao.busca({
            titulo: campo.buscapor,
            descricao: campo.buscapor
        }, function (err, result) {
            // content negociation
            res.format({
                html: function() {
                    res.render('produtos/lista', {resultado: result } );
                },
                json: function() {
                    res.json(result);
                }
            });
        });

        conn.end();
    });

    app.get('/produtos/form', (req, res) => {
        res.render('produtos/form', { errors: [], fields: {} });
    });

    app.post('/produtos/form', (req, res) => {
        // res.render('produtos/detail', req.body);
        // (req.body);

        const conn = app.infra.connectionFactory();

        const ProdutoDao = app.infra.ProdutoDao;

        let produtoDao = new ProdutoDao(conn);

        let livro = req.body;

        req.assert('titulo', 'O título é obrigatório.').notEmpty();
        req.assert('descricao', 'A descrição é obrigatória.').notEmpty();
        req.assert('valor', 'O preço deve ser maior que zero e ser maior que zero.').isFloat();

        const errors = req.validationErrors();
        if (errors) {
            console.log('Há erros de validação.');
            res.format({
                html: function() {
                    res.status(400).render('produtos/form', { errors: errors, fields: livro });
                },
                json: function() {
                    res.status(400).send(errors);
                }
            })
            return;
            // res.render('produtos/form', { errors: errors, fields: livro });
        } else {
            produtoDao.salvar(livro, function (err, result) {
                res.redirect('/produtos/salvo');
            });
        }


        conn.end();

    });

    app.get('/produtos/salvo', (req, res) => {
        res.render('produtos/salvo');
    });

    app.get('/produtos/deleta/:id', (req, res) => {
        let livro = {
            id: req.params.id
        };

        const conn = app.infra.connectionFactory();

        const ProdutoDao = app.infra.ProdutoDao;

        let produtoDao = new ProdutoDao(conn);

        produtoDao.busca(livro, function (err, result) {
            console.log(result);
            res.render('produtos/deleta', {fields: result});
        });

        conn.end();
    });
};