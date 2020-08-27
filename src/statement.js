function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    let volumeCredits = 0;
    let totalAmount = 0;
    const format = formatUsd();
    for (let perf of invoice.performances) {
        const play = getPlaysId(plays, perf);
        let thisAmount = caculateAmount(perf, play);
        // add volume credits
        volumeCredits += caculateCredits(perf, play);
        //print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

module.exports = {
    statement,
};

function caculateAmount(perf, play) {
    let thisAmount = 0;
    switch (play.type) {
        case 'tragedy':
            thisAmount = tragedyStrategy(perf);
            break;
        case 'comedy':
            thisAmount = comedyStrategy(perf);
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function getPlaysId(plays, perf) {
    return plays[perf.playID];
}

function comedyStrategy(perf) {
    let thisAmount = 30000;
    if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
    }
    thisAmount += 300 * perf.audience;
    return thisAmount;
}

function tragedyStrategy(perf) {
    let thisAmount = 40000;
    if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
    }
    return thisAmount;
}

function caculateCredits(perf, play) {
    let credit = Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type)
        credit += Math.floor(perf.audience / 5);
    return credit;
}

function formatUsd() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
}