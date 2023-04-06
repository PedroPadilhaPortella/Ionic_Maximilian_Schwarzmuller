const expensesList = document.querySelector('#expensesList');
const totalExpenses = document.querySelector('#totalExpenses');
const inputReason = document.querySelector('#inputReason');
const inputAmount = document.querySelector('#inputAmount');
const btnCancel = document.querySelector('#btnCancel');
const btnConfirm = document.querySelector('#btnConfirm');
const alert = document.querySelector('ion-alert');

let totalExpensesValue = 0;
totalExpenses.textContent = totalExpensesValue;

/* Create and add an expense to expensesList */
const createExpense = (reason, amount) => {
  const item = document.createElement('ion-item');
  item.textContent = `${reason}: $ ${amount}`;
  expensesList.appendChild(item);
}

/* Clear Form Fields  */
const clearForm = (args) => {
  for (var i = 0; i < args.length; i++) {
    args[i].value = null
  }
}

/* Sum total expenses  */
const calculateTotalExpenses = async (amount) => {
  totalExpensesValue += Number(amount);
  totalExpenses.textContent = totalExpensesValue;
}

/* Trigger Invalid Values Alert */
const triggerAlert = async () => {
  const alert = document.createElement('ion-alert');
  alert.header = 'Invalid Values';
  alert.message = 'Please enter a valid reason and amount!';
  alert.buttons = ['OK'];
  document.body.appendChild(alert);
  alert.present();
}

/* Event Listeners */
btnConfirm.addEventListener('click', () => {
  const enteredReason = inputReason.value;
  const enteredAmount = inputAmount.value;

  if(enteredReason.trim().length <= 0 || enteredAmount.trim().length  <= 0) {
    return triggerAlert();
  }

  createExpense(enteredReason, enteredAmount);
  calculateTotalExpenses(enteredAmount);
  clearForm([inputReason, inputAmount]);
});

btnCancel.addEventListener('click', () => {
  clearForm([inputReason, inputAmount]);
});