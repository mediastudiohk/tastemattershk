  let nextCount = 0;
  let backCount = 0;
  let deliverySchedule = {
    date: "",
    times: []
  }
  window.localStorage.removeItem('timeByDate')

const options = { weekday: 'long', month: 'short', day: 'numeric', };
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1); // set tomorrow's date

const dates = Array.from({ length: 28 }, (_, i) => {
    let date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    const dateArray = date.toLocaleString('en-US', options).replace(',', '').split(" ");
    const newDateString = dateArray[0] + " " + dateArray[2] + " " + dateArray[1];
    return newDateString;
});

let scheduleDateElement = document.querySelector(".delivery-schedule-item-date-wrapper");
let scheduleDateHtml = "";

const renderDate = (count) => {
  scheduleDateHtml = "";

  const renderDateHtml = (arr) => {
     arr.forEach((date) => {
      const dateArr = date.split(" ");
      scheduleDateHtml += `
        <div class="delivery-schedule-item-date flex flex-col center">
          <span>${dateArr[0]}</span>
          <span>${dateArr[1] + " " + dateArr[2]}</span>
        </div>
      `
    })
    return scheduleDateElement.innerHTML = scheduleDateHtml;
  }

  if(!count || count === 0){
    renderDateHtml(dates.slice(0, 7));
  } else{
    switch (count) {
      case 1:
        renderDateHtml(dates.slice(7, 14));
        break;

      case 2:
        renderDateHtml(dates.slice(14, 21));
        break;

      case 3:
        renderDateHtml(dates.slice(-7));
        break;

      default:
        return scheduleDateElement.innerHTML = "";
    }
  }

  
}
renderDate();

const onSchedule = (type) => {
  const iconNextElement = document.querySelector(".icon.next");
  const iconBackElement = document.querySelector(".icon.back");
  const element = document.getElementById("delivery-schedule-wrapper");

  if (type === 'next' && nextCount < 5) {
    nextCount++;
    backCount++;
    element.scrollLeft += 678;
    iconBackElement.style.visibility = "visible";
    renderDate(nextCount);
    const dateTimes = document.querySelectorAll('.delivery-schedule-item-date');
      for (date of dateTimes){
        date.classList.add("animation-next");
        date.classList.remove("animation-back");
      }

      const timeValues = document.querySelectorAll('.delivery-schedule-item-time');
      for (time of timeValues){
        time.classList.add("animation-next");
        time.classList.remove("animation-back");
      }
  } else {
    element.scrollLeft -= 678;
    backCount--;
    nextCount--;
    iconNextElement.style.visibility = "visible";
    renderDate(nextCount);
    const dateTimes = document.querySelectorAll('.delivery-schedule-item-date');
      for (date of dateTimes){
        date.classList.remove("animation-next");
        date.classList.add("animation-back");
      }

      const timeValues = document.querySelectorAll('.delivery-schedule-item-time');
      for (time of timeValues){
        time.classList.remove("animation-next");
        time.classList.add("animation-back");
      }
  }

  if (nextCount === 3) {
    iconNextElement.style.visibility = "hidden";
  }

  if (backCount === 0) {
    iconBackElement.style.visibility = "hidden";
  }
}

let scheduleTimeElement = document.querySelector(".delivery-schedule-item-time-wrapper");
let scheduleTimeHtml = "";

let scheduleTimes = [
  {
      date: "Sunday 1 Mar",
      times: []
  },
  {
      date: "Sunday 2 Mar",
      times: ["14:00 - 16:00"]
  },
  {
      date: "Sunday 3 Mar",
      times: []
  },
  {
      date: "Sunday 4 Mar",
      times: ["14:00 - 16:00"]
  },
  {
      date: "Sunday 5 Mar",
      times: []
  },
  {
      date: "Sunday 6 Mar",
      times: ["11:00 - 12:00", '12:00 - 13:00', "14:00 - 16:00", '15:00 - 17:00']
  },
  {
      date: "Sunday 7 Mar",
      times: []
  },
]

let timeByDate = {
  date: "",
  times: []
}

const onSelectItemValue = (item) => {
  const timeByDateLocal = window.localStorage.getItem('timeByDate') 
                          ? JSON.parse(window.localStorage.getItem('timeByDate')) 
                          : null;

  if (timeByDateLocal?.date === item.id) {
    if (item.classList.contains('selected')) {
      item.classList.remove('selected');

      timeByDate = {
        ...timeByDate,
        times: timeByDate.times.filter(i => i !== item.innerText)
      }

      if (!timeByDate.times.length) {
        window.localStorage.removeItem('timeByDate')
      } else {
        window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
      }
    } else {
      item.classList.add('selected');
      timeByDate = {
        ...timeByDate,
        times: [...timeByDate.times, item.innerText]
      }
      window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
    }
  } else {
    const timeValuesSelected = document.querySelectorAll('.delivery-schedule-item-time-value.selected');
    for (timeSelected of timeValuesSelected) {
      timeSelected.classList.remove('selected');
    }

    item.classList.add('selected');
    timeByDate = {
      date: item.id,
      times:  [item.innerText]
    }
    window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
  }
}


const renderTime = () => {
  scheduleDateHtml = '';
  scheduleTimes.forEach((item) => {
    scheduleTimeHtml += `
      <div class="delivery-schedule-item-time">
      ${!item.times.length
       ? `<div class="delivery-schedule-item-time-no-delivery">No Delivery</div>` 
       : `
       <div class="delivery-schedule-item-time-value-wrapper">
        ${item.times.map((i) => {
          return `<div class="delivery-schedule-item-time-value" id="${item.date}" onclick="onSelectItemValue(this)">
              ${i}
            </div>`
        }).join(" ")}
       </div>`
      }
      </div>`
  })

 scheduleTimeElement.innerHTML = scheduleTimeHtml;
}

renderTime();
