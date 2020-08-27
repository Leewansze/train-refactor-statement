function statement(invoice, plays) {
    return getTextResult(invoice, plays);
}

module.exports = {
    statement,
};

function getTextResult(invoice, plays) {
    let thisAmount = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = formatUsd();
    let totalAmount = calculateTotalAmount(invoice, plays);
    for (let perf of invoice.performances) {
        const play = getPlaysId(plays, perf);
        thisAmount = calculateAmount(perf, play);
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${calculateCredits(invoice, plays)} credits \n`;
    return result;
}

function calculateAmount(perf, play) {
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

function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        const play = getPlaysId(plays, perf);
        const thisAmount = calculateAmount(perf, play);
        totalAmount += thisAmount;
    }
    return totalAmount;
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

function calculateCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += Math.max(perf.audience - 30, 0);
        if ('comedy' === plays[perf.playID].type)
            volumeCredits += Math.floor(perf.audience / 5);
    }
    return volumeCredits;
}

function formatUsd() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
}

// function getHtmlResult(invoice, plays) {
//     var result = '<h1>Statement for BigCo</h1>\n' +
//         '<table>\n' +
//         '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
//         ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
//         ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
//         ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
//         '</table>\n' +
//         '<p>Amount owed is <em>$1,730.00</em></p>\n' +
//         '<p>You earned <em>47</em> credits</p>\n'
// }