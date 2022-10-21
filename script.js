'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-10-11T17:01:17.194Z',
    '2022-10-16T23:36:17.929Z',
    '2022-10-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const caclDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = caclDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${month}/${day}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovement = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
                    <div class="movements__date">${displayDate}</div> 
                    
                    <div class="movements__value">${formattedMovement}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const user = 'Steven Thomas Williams'; //stw

let sorted = true;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAcc, !sorted);
  sorted = !sorted;
});

const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  const formattedBalance = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
  labelBalance.textContent = formattedBalance;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const formattedIncomes = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(incomes);

  labelSumIn.textContent = formattedIncomes;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  const formattedOutcomes = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(Math.abs(out));

  labelSumOut.textContent = formattedOutcomes;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  const formattedInterest = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(interest);
  labelSumInterest.textContent = formattedInterest;
};

const createUserName = function (accaunts) {
  accaunts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};

createUserName(accounts);

const startLogoutTimer = function () {
  //setting the time to five minutes

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    //decrease 1 second

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    time--;
  };

  let time = 120;
  //call the time every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
  //in each call, print the remaining time to the user interface
  //when time expires, storp timer and log out user
};

let currentAcc, timer;

const updateUI = function (currentAcc) {
  displayMovements(currentAcc);
  calcAndPrintBalance(currentAcc);
  calcDisplaySummary(currentAcc);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Login');

  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAcc?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = '100';

    labelWelcome.textContent = `Welcome ${currentAcc.owner.split(' ')[0]}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    }
    timer = startLogoutTimer();
    updateUI(currentAcc);
  }

  const now = new Date();

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();

  // const hour = now.getHours();
  // const minute = `${now.getMinutes()}`.padStart(2, 0);

  // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${minute}`;
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAcc.locale,
    options
  ).format(now);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcc.balance >= amount &&
    currentAcc.userName !== receiverAcc?.userName
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
  }

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  //Reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov > amount * 0.1)) {
    setTimeout(function () {
      currentAcc.movements.push(amount);

      currentAcc.movementsDates.push(new Date().toISOString());

      clearInterval(timer);
      timer = startLogoutTimer();
      updateUI(currentAcc);
    }, 2500);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('delete');

  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAcc.userName
    );

    // console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Lecture 1

// console.log(23 === 23.0);

// //Base 10 0-9 1/10 = 0.1 3/10 =3.333
// //Base 2 0-1

// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// //string to numbers
// console.log(Number('23'));

// console.log(+'23');

// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10));
// console.log(Number.parseInt('  2.5rem'));
// console.log(Number.parseFloat(' 2.5rem'));
// console.log(parseFloat(' 2.5rem'));

// // check if value is not a number
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20px'));
// console.log(Number.isNaN(23 / 0));

// //checking if a value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20px'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23 / 0));

//lecture 2
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(8 ** (1 / 3));

// const numbers = [5, 9, 22, '30', 4, 1];

// console.log(Math.max(...numbers));
// console.log(Math.min(...numbers));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// // s

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(5, 8));

// //Rounding intigers

// console.log(Math.trunc(23.3));
// console.log(Math.round(23.5));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.9));

// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log(+(2.35).toFixed(2));

//lecture 3

// console.log(5 % 2);

// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3);

// console.log(8 / 3); // 8 = 2  * 3 + 2

// console.log(6 % 2);

// console.log(7 % 2);

// const isEven = n => (n % 2 === 0 ? 'It is even' : 'It is odd');

// console.log(isEven(7));

// labelBalance.addEventListener('click', function () {
//   document.querySelectorAll('.movements__row').forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

//lecture 4

// const diameter = 287_460_000_000;

// console.log(diameter);

// const price = 349_55;

// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.14_15;

// console.log(PI);

// console.log(Number('23000'));
// console.log(parseInt('230_000'));

//lecture 5

// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(Number.MAX_SAFE_INTEGER);

// console.log(645984684864864684648648646784645n);

// console.log(BigInt(6459846848648));

// //operations

// console.log(10000n + 10000n);
// console.log(465464684684156798489484684864n * 65486484468n);

// //multiplication
// const huge = 204654564784684584654n;
// const num = 23;
// console.log(huge * BigInt(num));

// //exceptions
// console.log(23n > 15);

// console.log(20n === 20);
// console.log(20n == '20');

// console.log(typeof 20n);

// console.log(`${huge} is really big`);

// //divison

// console.log(10n / 2n);
// console.log(10n / 3n);
// console.log(10 / 3);

//lecture 6

//Creat a date

// const now = new Date();

// console.log(now);

// console.log(new Date('Sun Oct 16 2022 23:38:54'));

// console.log(new Date('December 24, 2015'));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2017, 10, 19, 15, 23, 5));
// console.log(new Date(2017, 10, 33));

// console.log(new Date(0));

// console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with dates

// const future = new Date(2037, 10, 19, 15, 23);

// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142242580000));
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

//lecture 7

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const daysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// console.log(daysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14)));

//lecture 8

// const num = 388476.24;

// const options = {
//   style: 'percent',
//   unit: 'celsius',
//   currency: 'EUR',
// };
// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log(new Intl.NumberFormat('de-DE', options).format(num));
// console.log(new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(new Intl.NumberFormat(navigator.language, options).format(num));

//lecture 9

//setTimeout
// const ingredients = ['olives', ''];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// const numbers = [5, -2, 6, -3, 4, 1];

// const numMoreThanZero = numbers.filter(num => num > 0).map(num => num * 2);

// console.log(numMoreThanZero);

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// console.log(pizzaTimer);

//setInterval

setInterval(function () {
  const now = new Date();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minute = `${now.getMinutes()}`.padStart(2, 0);
  const secons = `${now.getSeconds()}`.padStart(2, 0);

  console.log(`${hour}:${minute}:${secons}`);
}, 1000);
