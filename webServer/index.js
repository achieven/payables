const express    = require('express')
const app        = express();
const bodyParser = require('body-parser');


const reconciliationEngine = require('../reconciliationEngine');
const reader               = require('../reader');
const validator            = require('./validator');

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

app.post(
    '/link',
    validator('amount', Number),
    validator('payment_reference', String),
    validator('payment_date', Date),
    (req, res) => {
        const payment = req.body;
        const payables = reconciliationEngine.getPayables(payment);
        res.json(payables);
    }
    );

