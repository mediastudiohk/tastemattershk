  let areaParam = '';
  let districtParam = '';

  const areaElement = document.querySelector('.checkout_section-select.area');
  const deliveryLocation = document.querySelector('#delivery-location');
  let areaElementHtml = '<option value="" class="area-item">Select one...</option>';
  const districtElement = document.querySelector('.checkout_section-select.district');
  let districtHtml = '<option value="" class="area-item">Select one...</option>';

  // delivery district
  const areas = [
    {
      label: 'Hong Kong Island',
      value: 'Hong Kong Island',
      districts: [
        {
          label: 'Central & Western',
          value: 'Central & Western',
        },
        {
          label: 'Wan Chai',
          value: 'Wan Chai',
        },
        {
          label: 'Eastern',
          value: 'Eastern',
        },
        {
          label: 'Southern',
          value: 'Southern',
        },
      ]
    },
    {
      label: 'Hong Kong Island - Piers',
      value: 'Hong Kong Island - Piers',
      districts: [
        {
          label: 'Central & Western - Pier 4 - Lamma',
          value: 'Central & Western - Pier 4 - Lamma',
        },
        {
          label: 'Central & Western - Pier 5 - Cheung Chau North & South',
          value: 'Central & Western - Pier 5 - Cheung Chau North & South',
        },
        {
          label: 'Central & Western - Pier 6 - Lantau, Mui Wo',
          value: 'Central & Western - Pier 6 - Lantau, Mui Wo',
        }
      ]
    },
    {
      label: 'Kowloon',
      value: 'Kowloon',
      districts: [
        {
          label: 'Yau Tsim Mong (Yau Ma Tei / Tsim Sha Tsui / Mong Kok / Kowloon West)',
          value: 'Yau Tsim Mong (Yau Ma Tei / Tsim Sha Tsui / Mong Kok / Kowloon West)',
        },
        {
          label: 'Sham Shui Po',
          value: 'Sham Shui Po',
        },
        {
          label: 'Kowloon City',
          value: 'Kowloon City',
        },
        {
          label: 'Wong Tai Sin',
          value: 'Wong Tai Sin',
        },
        {
          label: 'Kwun Tong',
          value: 'Kwun Tong',
        }
      ]
    },
    {
      label: 'New Territories 1',
      value: 'New Territories 1',
      districts: [
        {
          label: 'Kwai Tsing',
          value: 'Kwai Tsing',
        },
        {
          label: 'Tsuen Wan',
          value: 'Tsuen Wan',
        },
        {
          label: 'Tuen Mun',
          value: 'Tuen Mun',
        },
        {
          label: 'Yuen Long',
          value: 'Yuen Long',
        }
      ]
    },

    {
      label: 'New Territories 2',
      value: 'New Territories 2',
      districts: [
        {
          label: 'North',
          value: 'North',
        },
        {
          label: 'Tai Po',
          value: 'Tai Po',
        },
        {
          label: 'Sha Tin',
          value: 'Sha Tin',
        },
        {
          label: 'Sai Kung',
          value: 'Sai Kung',
        },
        {
          label: 'Sai Kung - Pier 1 - Sai Kung Islands',
          value: 'Sai Kung - Pier 1 - Sai Kung Islands',
        }
      ]
    },
    {
      label: 'Islands',
      value: 'Islands',
      districts: [
        {
          label: 'Islands - Discovery Bay',
          value: 'Islands - Discovery Bay',
        },
        {
          label: 'Islands - Tung Chung North & South',
          value: 'Islands - Tung Chung North & South',
        },
        {
          label: 'Islands - Yat Tung Estate North & South',
          value: 'Islands - Yat Tung Estate North & South',
        },
        {
          label: 'Islands - Ma Wan',
          value: 'Islands - Ma Wan',
        }
      ]
    },
  ]

  let districts = [];
  const renderDistricts = (arr) => {
    districtHtml = '<option value="" class="area-item">Select one...</option>'
    arr.forEach((district) => {
      districtHtml += `
      <option value="${district.value}" class="district-item">${district.label}</option>
      `
    })
    districtElement.innerHTML = districtHtml;
    districtElement.addEventListener('change', (event) => {
      deliveryLocation.innerHTML = `${areaElement.value} / ${event.target.value}`;
      fetchData(encodeURIComponent(areaElement.value), encodeURIComponent(districtElement.value))
    })
  }

  areas.forEach((area) => {
    areaElementHtml += `
    <option value="${area.value}" class="area-item">${area.label}</option>
    `
  })

  areaElement.innerHTML = areaElementHtml;
  areaElement.addEventListener('change', (event) => {
    deliveryLocation.innerHTML = event.target.value;
    districts = areas.find((area) => area.value === event.target.value).districts || [];
    renderDistricts(districts);
    fetchData(encodeURIComponent(areaElement.value))
  })


// delivery schedule
const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
}

const formatDate = (date) => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const options = { weekday: 'long', month: 'short', day: 'numeric', };
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1); // set tomorrow's date

let dates = Array.from({ length: 28 }, (_, i) => {
    let date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    const dateArray = date.toLocaleString('en-US', options).replace(',', '').split(" ");
    const newDateString = dateArray[0] + " " + dateArray[2] + " " + dateArray[1];
    return {
      shortTitle: date.toLocaleString('en-US', {
        weekday: 'short'
      }),
      title: newDateString,
      value: formatDate(date),
      times: []
    };
});

let scheduleDateElement = document.querySelector(".delivery-schedule-item-date-wrapper");
let scheduleDateHtml = "";
let scheduleTimeElement = document.querySelector(".delivery-schedule-item-time-wrapper");
let scheduleTimeHtml = "";

let timeByDate = {
  id_schedule_default: null,
  date: "",
  order_name: "",
  times: [],
  id_schedule: null
}

const renderDate = (count) => {
  scheduleDateHtml = "";

  const renderDateHtml = (arr) => {
     arr.forEach((date) => {
      const dateArr = date.title.split(" ");
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

const onSelectItemValue = (item) => {
  const timeValuesSelected = document.querySelectorAll('.delivery-schedule-item-time-value.selected');
  for (timeSelected of timeValuesSelected) {
    timeSelected.classList.remove('selected');
  }

  item.classList.add('selected');
  timeByDate = {
    id_schedule_default: Number(item.id),
    id_schedule: Number(item.id),
    date: item.title,
    time: item.innerText
  }

  window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
}

const renderTime = (count) => {
  scheduleTimeHtml = '';

  const renderTimeHtml = (arr) => {
    arr.forEach((item) => {
      scheduleTimeHtml += `
        <div class="delivery-schedule-item-time">
        ${!item.times.length
        ? `<div class="delivery-schedule-item-time-no-delivery">No Delivery</div>` 
        : `
        <div class="delivery-schedule-item-time-value-wrapper">
          ${item.times.map((i) => {
              return `<div class="delivery-schedule-item-time-value ${i?.is_maximum_order ? "maximum-order" : ""}" id="${i.id_schedule || i.id_schedule_default}" title="${item.value}"
                onclick="onSelectItemValue(this)"
                >
                  <span>${i.comment}</span>
                  <span>
                    <svg
                      class="icon icon-checkmark color-foreground-text"
                      aria-hidden="true"
                      focusable="false"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 9"
                      fill="none"
                    >
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.35.643a.5.5 0 01.006.707l-6.77 6.886a.5.5 0 01-.719-.006L.638 4.845a.5.5 0 11.724-.69l2.872 3.011 6.41-6.517a.5.5 0 01.707-.006h-.001z" fill="#30b90e"/>
                    </svg>
                  </span>
                </div>`
          }).join(" ")}
        </div>`
        }
        </div>`
    })
    return scheduleTimeElement.innerHTML = scheduleTimeHtml;
  }

  if(!count || count === 0){
    renderTimeHtml(dates.slice(0, 7));
  } else{
    switch (count) {
      case 1:
        renderTimeHtml(dates.slice(7, 14));
        break;

      case 2:
        renderTimeHtml(dates.slice(14, 21));
        break;

      case 3:
        renderTimeHtml(dates.slice(-7));
        break;

      default:
        return scheduleTimeElement.innerHTML = "";
    }
  }
}

renderTime();

let nextCount = 0;
let backCount = 0;

const onSchedule = (type) => {
  const iconNextElement = document.querySelector(".icon-schedule.next");
  const iconBackElement = document.querySelector(".icon-schedule.back");
  const element = document.getElementById("delivery-schedule-wrapper");

  if (type === 'next' && nextCount < 5) {
    nextCount++;
    backCount++;
    element.scrollLeft += 678;
    iconBackElement.style.visibility = "visible";
    renderDate(nextCount);
    renderTime(nextCount);
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
    renderTime(nextCount);
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

const fetchData = async (area = '', district = '') => {
  const controller = new AbortController();
  const signal = controller.signal;
  const url = 'https://intl-rolled-beth-precious.trycloudflare.com';

  try {
    const res = await fetch(`${url}/api/schedule-order?area=${area}&district=${district}&fromDate=${dates[0].value}&toDate=${dates[dates.length - 1].value}`, { signal });
    const data = await res.json();
    if(data.response){
      const scheduleDefault = data.response.scheduleDefault;
      const schedule = data.response.schedule;

      dates = dates.map((date) => {
        return {
          ...date,
          times: (schedule[date.value] || scheduleDefault[date.shortTitle] || []).filter((i) => i.maximum_order > 0).sort((a, b) => a.priority - b.priority)
        }
      })
     
      renderTime(nextCount);
    }
  } catch (error) {
    console.log('error', error);
  }
}

fetchData();

const onCheckout = () => {
  console.log('onCheckout');
}