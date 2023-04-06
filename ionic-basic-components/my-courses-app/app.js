const coursesList = document.querySelector('#coursesList');
const inputName = document.querySelector('#inputName');
const inputRating = document.querySelector('#inputRating');
const btnConfirm = document.querySelector('#btnConfirm');
const alert = document.querySelector('ion-alert');

/* Create and add an course to coursesList */
const addCourse = (reason, amount) => {
  const item = document.createElement('ion-item');
  item.innerHTML = `<strong>${reason}</strong> -  ${amount}`;
  coursesList.appendChild(item);
}

/* Trigger Invalid Values Alert */
const triggerAlert = async () => {
  const alert = document.createElement('ion-alert');
  alert.header = 'Invalid Course';
  alert.message = 'Please enter a valid course and rating!';
  alert.buttons = ['OK'];
  document.body.appendChild(alert);
  alert.present();
}

/* Event Listeners */
btnConfirm.addEventListener('click', () => {
  console.warn("ok")
  const name = inputName.value;
  const rating = inputRating.value;

  if(name.trim().length <= 0 || rating.trim().length  <= 0) {
    return triggerAlert();
  }

  addCourse(name, rating);
});