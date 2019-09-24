const express = require('express')
const app = express();
const bodyParser = require('body-parser');


const reconciliationEngine = require('../reconciliationEngine/index');
const reader = require('../reader');

initReconciliationEngine();

function initReconciliationEngine () {
    const payables = reader.initPayables();
    reconciliationEngine.build(payables);
}


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hello")
})

app.post('/',
    validate('amount', Number),
    validate('payment_reference', String),
    validate('payment_date', Date),
    (req, res) => {
    const payment = req.body;
    const payables = reconciliationEngine.getPayables(payment);
    res.json(payables);
    }
    )

function  validate(parameterName, validation) {
    return (req, res, next) => {
        if (validation === Number) {
            if (typeof req.body[parameterName] !== 'number') {
                return res.status(400).send(`${parameterName} is not a number!`);
            }
        } else if (validation === String) {
            if (typeof req.body[parameterName] !== 'string') {
                return res.status(400).send(`${parameterName} is not a string!`);
            }
        } else if (validation === Date) {
            //If I had more time I would implement this
            return next();
        }

        return next();
    }
}