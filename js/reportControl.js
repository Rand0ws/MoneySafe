import { OverlayScrollbars } from './overlayscrollbars.esm.min.js';
import { deleteData, getData } from './service.js';
import { reformatDate } from './helpers.js';
import { storage } from './storage.js';

const typesOperation = {
  income: 'доход',
  expenses: 'расход',
};

const body = document.body;
const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportTable = document.querySelector('.report__table');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates');

OverlayScrollbars(report, {});

const closeReport = ({ target }) => {
  if (!target.closest('.report') && target !== financeReport || target.closest('.report__close')) {
    gsap.to(report, {
      opacity: 0,
      scale: 0,
      duration: .3,
      ease: 'power2.in',
      onComplete() {
        report.style.visibility = 'hidden';
      }
    });

    body.removeEventListener('click', closeReport);
  }
};

const openReport = () => {
  report.style.visibility = 'visible';

  gsap.to(report, {
    opacity: 1,
    scale: 1,
    duration: .3,
    ease: 'power2.out',
  });

  body.addEventListener('click', closeReport);
};

const renderReport = (data) => {
  reportOperationList.textContent = '';

  const reportRows = data.map(({ category, amount, description, date, type, id }) => {
    const reportRow = document.createElement('tr');

    reportRow.classList.add('report__row');

    reportRow.innerHTML = `
      <td class="report__cell">${category}</td>
      <td class="report__cell">${amount.toLocaleString()}&nbsp;₽</td>
      <td class="report__cell">${description}</td>
      <td class="report__cell">${reformatDate(date)}</td>
      <td class="report__cell">${typesOperation[type]}</td>
      <td class="report__action-cell">
        <button class="report__button report__button_table" data-id="${id}">&#10006;</button>
      </td>
    `;

    return reportRow;
  });

  reportOperationList.append(...reportRows);
};

export const reportControl = () => {
  reportTable.addEventListener('click', ({ target }) => {
    const targetSort = target.closest('[data-sort]');

    if (targetSort) {
      const sortField = targetSort.dataset.sort;

      renderReport(
        [...storage.data].sort((a, b) => {
            if (targetSort.dataset.dir === 'asc') {
              [a, b] = [b, a];
            }

            if (sortField === 'amount') {
              return a[sortField] - b[sortField];
            }

            return a[sortField] < b[sortField] ? -1 : 1;
          })
      );

      if (targetSort.dataset.dir === 'asc') {
        targetSort.dataset.dir = 'desc';
      } else {
        targetSort.dataset.dir = 'asc';
      }
    }

    const id = target.dataset?.id;

    if (id) {
      deleteData(`/finance/${id}`);
    }
  });

  financeReport.addEventListener('click', async () => {
    const textContent = financeReport.textContent;

    financeReport.textContent = 'Загрузка';
    financeReport.disabled = true;

    const data = await getData('/finance');

    storage.data = data;
    financeReport.textContent = textContent;
    financeReport.disabled = false;

    renderReport(data);
    openReport();
  });

  reportDates.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(reportDates));
    const searchParams = new URLSearchParams();

    if (formData.startDate) {
      searchParams.append('startDate', formData.startDate);
    }

    if (formData.endDate) {
      searchParams.append('endDate', formData.endDate);
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/finance?${queryString}` : '/finance';
    const data = await getData(url);

    renderReport(data);
  });
};
