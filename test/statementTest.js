const test = require('ava');
const {statement} = require('../src/statement');

test('Sample test', t => {
  t.true(true);
  t.is(1, 1);
  t.deepEqual({a: 1}, {a: 1});
});

//test('Sample test', t => {
//  //given
//  const invoice = {};
//  const plays = [];
//
//  const result = statement(invoice, plays);
//
//  t.is(result, '');
//});

test('Customer BigCo without performance.', t =>{
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };
  //when
  const result = statement(invoice, plays);
  //then
  t.is(result, 'Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n')
})

test('Customer BigCo has one performance hamlet and audience is 30', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      }
    ],
  };
  //when
  const result = statement(invoice, plays);
  //then
  t.is(result,'Statement for BigCo\n'+
    ' Hamlet: $400.00 (30 seats)\nAmount owed is $400.00\nYou earned 0 credits \n')
})

test('Customer BigCo has one performance as-like and audience is 20', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      }
    ],
  };
  //when
  const result = statement(invoice, plays)
  //then
  t.is(result, 'Statement for BigCo\n'+
                   ' As You Like It: $360.00 (20 seats)\nAmount owed is $360.00\nYou earned 4 credits \n')
})


const invoice = {
  'customer': 'BigCo',
  'performances': [
    {
      'playID': 'hamlet',
      'audience': 55,
    },
    {
      'playID': 'as-like',
      'audience': 35,
    },
    {
      'playID': 'othello',
      'audience': 40,
    },
  ],
};


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};