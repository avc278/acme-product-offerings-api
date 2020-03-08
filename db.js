const Sequelize = require('sequelize');
const pg = require('pg');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_offerings_api');

const { INTEGER, UUID, STRING, UUIDV4 } = Sequelize;

const uuidDefinition = {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
};

const nameDefinition = {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true,
    }
};

const Product = conn.define('product', {
    id: uuidDefinition,
    name: nameDefinition,
    suggestedPrice: INTEGER,
});

const Company = conn.define('company', {
    id: uuidDefinition,
    name: nameDefinition,
});

const Offering = conn.define('offering', {
    id: uuidDefinition,
    name: nameDefinition,
    price: INTEGER,
});

Company.hasMany(Offering);
Product.hasMany(Offering);
Offering.belongsTo(Company);
Offering.belongsTo(Product);

const syncAndSeed = async() => {
    await conn.sync({ force: true} );

    const [ laptop, book, pen ] = await Promise.all([
        Product.create({
            name: 'laptop',
            suggestedPrice: 100
        }),
        Product.create({
            name: 'book',
            suggestedPrice: 200
        }),
        Product.create({
            name: 'pen',
            suggestedPrice: 300
        })
    ]);
    const [ amazon, ebay, target ] = await Promise.all([
        Company.create({
            name: 'amazon'
        }),
        Company.create({
            name: 'ebay'
        }),
        Company.create({
            name: 'target'
        })
    ]);
    const [ laptopOffering1, laptopOffering2, bookOffering1, bookOffering2, penOffering1, penOffering2 ] = await Promise.all([
        Offering.create({
            name: 'laptop at ebay',
            price: 400,
            companyId: ebay.id,
            productId: laptop.id
        }),
        Offering.create({
            name: 'laptop at amazon',
            price: 450,
            companyId: amazon.id,
            productId: laptop.id
        }),
        Offering.create({
            name: 'book at target',
            price: 500,
            companyId: target.id,
            productId: book.id
        }),
        Offering.create({
            name: 'book at ebay',
            price: 550,
            companyId: ebay.id,
            productId: book.id
        }),
        Offering.create({
            name: 'pen at amazon',
            price: 600,
            companyId: amazon.id,
            productId: pen.id
        }),
        Offering.create({
            name: 'pen at target',
            price: 650,
            companyId: target.id,
            productId: pen.id
        })
    ]);
}

module.exports = {
    syncAndSeed,
    models: {
        Product,
        Company,
        Offering
    }
}
