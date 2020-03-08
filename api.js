const app = require('express').Router();
const db = require('./db');
const {Product, Company, Offering } = db.models;

const _routes = [
    {path: '/products', model: Product },
    {path: '/companies', model: Company },
    {path: '/offerings', model: Offering }
];

_routes.forEach( route => {
    app.get(route.path, (req, res, next) => {
        route.model.findAll()
            .then( row => res.send(row))
            .catch(ex => console.log(ex));
    });
});

module.exports = app;
