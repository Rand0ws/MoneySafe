import { convertStringNumber } from './convertStringNumber.js';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');

let amount = 0;

financeAmount.textContent = amount;

financeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const typeOperation = e.submitter.dataset.typeOperation;
  const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value));

  if (typeOperation === 'income') {
    amount += changeAmount;
  }

  if (typeOperation === 'expenses') {
    amount -= changeAmount;
  }

  financeAmount.textContent = `${amount.toLocaleString()} ₽`;
});

const financeReport = document.querySelector('.finance__report');
const report = document.querySelector('.report');

financeReport.addEventListener('click', () => {
  report.classList.add('report__open');
});

const body = document.body;

body.addEventListener('click', (e) => {
  const target = e.target;

  if (!target.closest('.report') && target !== financeReport || target.closest('.report__close')) {
    report.classList.remove('report__open');
  }
});
