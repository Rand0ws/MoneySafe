import { financeControl } from './financeControl.js';
import { reportControl } from './reportControl.js';
import { dataListControl } from './dataListControl.js';

const init = () => {
  financeControl();
  reportControl();
  dataListControl();
};

init();
