class App {
  constructor() {
    this.carContainerElement = document.getElementById("car-list");
    this.filterTipeDriver = document.getElementById("filter-type-driver");
    this.filterTanggal = document.getElementById("filter-tanggal");
    this.filterWaktu = document.getElementById("filter-waktu");
    this.filterJumlahPenumpang = document.getElementById("filter-jumlah-penumpang");
    this.submitButton = document.getElementById("submit-car");
    this.submitForm = document.getElementById("form-car");

    this.submitForm.addEventListener("submit", this.handleFormSubmit);

    this.formInputs = document.querySelectorAll("input, select");

    this.formInputs.forEach((input) => {
      input.addEventListener("focus", this.showOverlay);
      input.addEventListener("blur", this.hideOverlay);
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.filterCars();
  };

  showOverlay() {
    document.getElementById("overlay").style.display = "block";
  }

  hideOverlay() {
    document.getElementById("overlay").style.display = "none";
  }

  async init() {
    await this.load();
  }

  run = () => {
    let cardHtml = "";
    const cars = Car.list.length;
    for (let i = 0; i < cars; i++) {
      const carList = Car.list[i];

      if (i % 3 === 0) {
        if (i > 0) {
          cardHtml += "</div>";
        }
        cardHtml += '<div class="row mb-4">';
      }

      cardHtml += carList.render();

      if (i === cars - 1) {
        cardHtml += "</div>";
      }
    }

    const listCar = document.createElement("div");
    listCar.innerHTML = cardHtml;
    this.carContainerElement.appendChild(listCar);
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
  }

  clear = () => {
    while (this.carContainerElement.firstElementChild) {
      this.carContainerElement.firstElementChild.remove();
    }

    this.filterJumlahPenumpang.value = "";
    this.filterTanggal.value = "";
    this.filterWaktu.value = "";
    this.filterTipeDriver.value = "";
  };

  renderCars(cars) {
    let cardHtml = "";
    const carsCount = cars.length;
    console.log(carsCount);
    for (let i = 0; i < carsCount; i++) {
      const car = cars[i];

      if (i % 3 === 0) {
        if (i > 0) {
          cardHtml += "</div>";
        }
        cardHtml += '<div class="row mb-4">';
      }

      cardHtml += car.render();

      if (i === carsCount - 1) {
        cardHtml += "</div>";
      }
    }

    const listCar = document.createElement("div");
    listCar.innerHTML = cardHtml;
    this.carContainerElement.appendChild(listCar);
  }

  filterCars() {
    const tipeDriverValue = this.filterTipeDriver.value;
    const tanggalValue = this.filterTanggal.value;
    const waktuValue = this.filterWaktu.value;
    const jumlahPenumpangValue = this.filterJumlahPenumpang.value;
    const inputDateTime = new Date(tanggalValue + " " + waktuValue);

    console.log(`inputDateTime: ${inputDateTime}`);

    const filteredCars = Car.list.filter((car) => {
      const availableDateTime = new Date(car.availableAt);
      console.log(`availableDateTime: ${availableDateTime}`);
      const isDateValid = inputDateTime > availableDateTime;
      const isPassengerValid = !jumlahPenumpangValue || car.capacity === parseInt(jumlahPenumpangValue);

      return isDateValid && isPassengerValid;
    });

    this.clear();

    this.renderCars(filteredCars);
  }
}
