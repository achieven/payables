const editingDistance = 1;
const datesDistance = 1000 * 60 *60 * 24 * 7;
const amountDistance = 100;

exports.build = (payables) => {
    this.payables = payables;
}

//if I had more time I would support multiple reference ids, as in the example
//There is probably some duplicate login  for matching 2 out of 3, if I had more time I would investigate and reduce the running time of it
//If I had more time I would write thorough tests with mocha.js for this
//I also started to implement editing distance between the dates (for example same date, give or take 1 day a month ago, or a year ago, but I don't have time for this right now)
//I'm assuming correctness of input from client (if not handled by web server) and from json file

exports.getPayables = (payment) => {
    const identicalByReference = this.payables.filter((payable) => {
        return payment.payment_reference === payable.referenceId;
    });
    const identicalByDate = this.payables.filter((payable) => {
        return payment.payment_date === payable.dateOccurred;
    });
    const identicalByAmount = this.payables.filter((payable) => {
        return payment.amount === payable.amount;
    });
    const similarByReferenceAndDate = this.payables.filter((payable) => {
        const dateDistance = getEditDistance(payment.payment_reference, payable.referenceId);
        return getEditDistance(payment.payment_reference, payable.referenceId) <= editingDistance && dateDistance <= datesDistance;
    });
    const similarByReferenceAndAmount = this.payables.filter((payable) => {
        return getEditDistance(payment.payment_reference, payable.referenceId) <= editingDistance && getAmountDistance(payment.amount, payable.amount) <= amountDistance;
    });
    const similarByDateAndAmount = this.payables.filter((payable) => {
        return getDateDistance(payment.payment_date, payable.dateOccurred) <= datesDistance && getAmountDistance(payment.amount, payable.amount) <= amountDistance;
    });
    const uniqueMatches = [].concat(
        identicalByReference,
        identicalByDate,
        identicalByAmount,
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