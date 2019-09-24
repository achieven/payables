# Payables

## Comments:

### Reconciliation Engine: 
###### if I had more time I would support multiple reference ids, as in the example ({'amount': 134, 'payment_reference': 'AB12141 12451141414', 'payment_date': '2017-10-18'})
###### There is some duplicate logic in the matching function (as I implemented this), specifically in the matching of 2 out of 3. It is calling twice for each function. if I had more time I would investigate and reduce this duplicacy, hence - reduce the running time of it, as well as ease of readability
###### As well I would have implement some partial score. For example exact matching give spartial score of 1, editing distance of 1 would give a partial score of 50 and editing distance of 2 would give 25 etc.. (doesn't have to to be scaled by 2, but a Geometric progression of some sort, give or take fixed variables. So it would be in the pattern of f(x) = a + (1/factor)*distance, obviously with different factor for date/amount/referenceId
###### If I had more time I would write thorough tests with mocha.js for this function
###### I also started to implement editing distance between the dates (for example same date, give or take 1 day a month ago, or a year ago, but I don't have time for this right now)
###### I'm assuming correctness from json file/graphQL (from the client it's implemented by the web server)

### Web Server
###### If I had more time I would implement date validation

### GraphQL
###### I did manage to get the payable by the business id using the field "businessTransactions" under business and then using field "payable" under transaction, but I didn't have time to implement this.

## How to run
###### clone the project
###### cd payables
###### npm install
###### node webServer/index.js
