const EDITING_DISTANCE_THRESHOLD = 1;
const DATE_DURATION_THRESHOLD = 1000 * 60 *60 * 24;
const AMOUNT_DIFFERENCE_THRESHOLD = 100;

exports.build = (payables) => {
    this.payables = payables;
};

//if I had more time I would support multiple reference ids, as in the example
//There is some duplicate logic in the matching function (as I implemented this), specifically in the matching of 2 out of 3. It is calling twice for each function. if I had more time I would investigate and reduce this duplicacy, hence - reduce the running time of it, as well as ease of readability
//As well I would have implement some partial score. For example exact matching give spartial score of 1, editing distance of 1 would give a partial score of 50 and editing distance of 2 would give 25 etc.. (doesn't have to to be scaled by 2, but a Geometric progression of some sort, give or take fixed variables. So it would be in the pattern of f(x) = a + (1/factor)*distance, obviously with different factor for date/amount/referenceId
//If I had more time I would write thorough tests with mocha.js for this function
//I also started to implement editing distance between the dates (for example same date, give or take 1 day a month ago, or a year ago, but I don't have time for this right now)
//I'm assuming correctness of input from client (implemented by web server) and from json file/graphQL

exports.getPayables = (payment) => {
    const identicalByReference = this.payables.filter((payable) => {
        return payment.payment_reference === payable.referenceId;
    });
    const identicalByDateAndAmount = this.payables.filter((payable) => {
        return payment.payment_date === payable.dateOccurred && payment.amount === payable.amount;
    });
    const similarByReferenceAndDate = this.payables.filter((payable) => {
        return getEditDistance(payment.payment_reference, payable.referenceId) <= EDITING_DISTANCE_THRESHOLD && getDateDistance(payment.payment_date, payable.dateOccurred) <= DATE_DURATION_THRESHOLD;
    });
    const similarByReferenceAndAmount = this.payables.filter((payable) => {
        return getEditDistance(payment.payment_reference, payable.referenceId) <= EDITING_DISTANCE_THRESHOLD && getAmountDistance(payment.amount, payable.amount) <= AMOUNT_DIFFERENCE_THRESHOLD;
    });
    const similarByDateAndAmount = this.payables.filter((payable) => {
        return getDateDistance(payment.payment_date, payable.dateOccurred) <= DATE_DURATION_THRESHOLD && getAmountDistance(payment.amount, payable.amount) <= AMOUNT_DIFFERENCE_THRESHOLD;
    });
    const uniqueMatches = [].concat(
        identicalByReference,
        identicalByDateAndAmount,
        similarByReferenceAndDate,
        similarByReferenceAndAmount,
        similarByDateAndAmount).filter((payment, index, self) => {
        return self.map((payment) => {
            return payment.id;
        }).indexOf(payment.id) === index;
    });

    return uniqueMatches;

};

function getAmountDistance (amount1, amount2) {
    return Math.abs(amount1 - amount2);
}

function getDateDistance (d1,d2) {
    const diffMS = Math.abs(new Date(d1) - new Date(d2));
    return diffMS;
}


//code from https://gist.github.com/andrei-m/982927
function getEditDistance (str1, str2){
    if(str1.length == 0) return str2.length;
    if(str2.length == 0) return str1.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= str2.length; i++){
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= str1.length; j++){
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= str2.length; i++){
        for(j = 1; j <= str1.length; j++){
            if(str2.charAt(i-1) == str1.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[str2.length][str1.length];
};

function getPayablesByReferenceId (referenceId) {

}