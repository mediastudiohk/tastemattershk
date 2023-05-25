  let areaParam = '';
  let districtParam = '';
  const TIME_BY_DATE_DEFAULT = {
    region: "",
    district: "",
    schedule: {
      id_schedule_default: null,
      date: "",
      order_name: "",
      time: "",
      id_schedule: ""
    },
    option: ""
  }

  const areaSelect = document.querySelector('.checkout_section-select.area');
  const deliveryLocation = document.querySelector('#delivery-location');
  let areaElementHtml = '<option value="" class="area-item">Select one...</option>';
  const districtSelect = document.querySelector('.checkout_section-select.district');
  let districtHtml = '<option value="" class="area-item">Select one...</option>';
  const regionElement = document.querySelector(".region")
  const areaValidate = regionElement.querySelector(".validate-schedule");

  const districtElement = document.querySelector(".district")
  const districtValidate = districtElement.querySelector(".validate-schedule");

  const timeSlotElement = document.querySelector(".timeslot")
  const timeSlotValidate = timeSlotElement.querySelector(".validate-schedule");

  const timeByDateStorage = window.localStorage.getItem('timeByDate');

const inputRadio = document.querySelectorAll('input[name="delivery-option"]')

  let timeByDate = {
    region: JSON.parse(timeByDateStorage)?.region || "",
    district: JSON.parse(timeByDateStorage)?.district || "",
    schedule: {
      id_schedule_default:  JSON.parse(timeByDateStorage)?.schedule?.id_schedule_default || null,
      date: JSON.parse(timeByDateStorage)?.schedule?.date || "",
      order_name: JSON.parse(timeByDateStorage)?.schedule?.order_name || "",
      time: JSON.parse(timeByDateStorage)?.schedule?.time || "",
      id_schedule: JSON.parse(timeByDateStorage)?.schedule?.id_schedule || null,
    },
    option: ""
  }

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

  let districts = timeByDate.region 
                  ? areas.find((area) => area.value === timeByDate.region).districts
                  : areas[0].districts;

  const renderDistricts = (arr) => {
    districtHtml = '<option value="" class="area-item">Select one...</option>'
    arr.forEach((district) => {
      districtHtml += `
      <option value="${district.value}" class="district-item">${district.label}</option>
      `
    })
    districtSelect.innerHTML = districtHtml;
    districtSelect.addEventListener('change', (event) => {
      const { value } = event.target;
      timeSlotValidate.classList.remove('invalid');
      if(value !== "") {
        districtValidate.classList.remove('invalid');
        districtSelect.classList.remove('invalid');
      }
      deliveryLocation.innerHTML = `${areaSelect.value} / ${value}`;
      timeByDate = {
        ...timeByDate,
        district: value,
        schedule: TIME_BY_DATE_DEFAULT.schedule
      }
      window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
      fetchData(encodeURIComponent(areaSelect.value), encodeURIComponent(districtSelect.value))
    })
  }

  areas.forEach((area) => {
    areaElementHtml += `
    <option value="${area.value}" class="area-item">${area.label}</option>
    `
  })

  areaSelect.innerHTML = areaElementHtml;
  areaSelect.addEventListener('change', (event) => {
    const { value } = event.target;
    deliveryLocation.innerHTML = value;
    districtValidate.classList.remove('invalid');
    districtSelect.classList.remove('invalid');
    timeSlotValidate.classList.remove('invalid');
    if(value !== "") {
      areaValidate.classList.remove('invalid');
      areaSelect.classList.remove('invalid');
    }
    const districtsByArea = areas.find((area) => area.value === value)
    districts = districtsByArea ? districtsByArea.districts : [];
    renderDistricts(districts);
    timeByDate = {
      ...timeByDate,
      region: value,
      district: "",
      schedule: TIME_BY_DATE_DEFAULT.schedule
    }
    window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
    fetchData(encodeURIComponent(areaSelect.value))
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
  const isMaximumOrder = item.classList.contains('maximum-order');
  if(!isMaximumOrder) {
    const timeValuesSelected = document.querySelectorAll('.delivery-schedule-item-time-value.selected');
    for (timeSelected of timeValuesSelected) {
      timeSelected.classList.remove('selected');
    }
    timeSlotValidate.classList.remove('invalid');

    item.classList.add('selected');
    const scheduleTimeByDate = {
      id_schedule_default: Number(item.id),
      id_schedule: Number(item.id),
      date: item.title,
      time: item.innerText
    }
    timeByDate = {
      ...timeByDate,
      schedule: scheduleTimeByDate
    }

    window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));


    dates = dates.map((date) => ({
      ...date,
      times: date.times.map((time) => {
        const isSelected = item.title === time.schedule_date && item.innerText === time.comment;

        return {
          ...time,
          selected: isSelected
        }
      })
    }))
  }
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
              return `<div class="delivery-schedule-item-time-value ${i.selected ? "selected" : ""} ${i?.is_maximum_order ? "maximum-order" : ""}" id="${i.id_schedule || i.id_schedule_default}" title="${item.value}"
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
  const url = 'https://msh-api.vmodev.link';

  try {
    const res = await fetch(`${url}/api/schedule-order?area=${area}&district=${district}&fromDate=${dates[0].value}&toDate=${dates[dates.length - 1].value}`, { signal });
    const data = await res.json();
    if(data.response){
      const scheduleDefault = data.response.scheduleDefault;
      const schedule = data.response.schedule;
      const scheduleExist = data.response.scheduleExist;

      dates = dates.map((date) => {
        const isScheduleExits = !!scheduleExist[date.value];

        return {
          ...date,
          times: (isScheduleExits ? schedule[date.value] : scheduleDefault[date.shortTitle]) || []
        }
      })

      renderTime(nextCount);
    }
  } catch (error) {
    console.log('error', error);
  }
}


  areaSelect.value = timeByDate.region || areas[0].value;
  renderDistricts(districts);
  districtSelect.value = timeByDate.district || "";

  timeByDate = {
    ...timeByDate,
    region: timeByDate.region || areas[0].value,
    option: timeByDate.option || inputRadio[0].value
  }
  window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));

fetchData(encodeURIComponent(areaSelect.value),encodeURIComponent(districtSelect.value));


// delivery option
if(inputRadio) {
  for (const radio of inputRadio) {
    radio.checked = (timeByDate.option || JSON.parse(timeByDateStorage)?.option) === radio.value;
    radio.addEventListener('change', (event) => {
      radio.checked = true;
  
      timeByDate = {
        ...timeByDate,
        option: event.target.value
      }
      window.localStorage.setItem('timeByDate', JSON.stringify(timeByDate));
    })
  }
}

const onCheckout = () => {

  if(timeByDate?.region === "") {
    areaValidate.classList.add('invalid');
    areaSelect.classList.add('invalid');
    regionElement.scrollIntoView({
      behavior: "smooth"
    })
    return;
  } else if(timeByDate?.district === ""){
    districtValidate.classList.add('invalid');
    districtSelect.classList.add('invalid');
    districtElement.scrollIntoView({
      behavior: "smooth"
    })
    return;
  } else if (timeByDate?.schedule?.time === "") {
    timeSlotValidate.classList.add('invalid');
    timeSlotElement.scrollIntoView({
      behavior: "smooth"
    })
    return;
  }

  return window.location.href = "/checkout"
}