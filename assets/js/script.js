const container = document.getElementById("container");
const cardsWrapper = document.getElementById("cards-wrapper");
const modalResultado = document.getElementById("modal-resultado");
const inicioJuego = document.getElementById("inicioJuego");
const allBtn = document.querySelectorAll(".card");
const timeBox = document.getElementById("time");

//ingresado por el usuario, es para definir la cantidad de cartas en fetchData
let numberOfCards;

//timepo que se muestran las cartas
let time;

function cantidadCartas(event) {
  event.preventDefault();

  //obtener el numero de cartas que elige el usuario
  numberOfCards = document.getElementById("num-of-cards").value;

  //esconder la seccion de inicio
  inicioJuego.classList.add("hidden");

  //mostrar el memorice
  container.classList.remove("hidden");

  //llamar a la funcion fetchData para que traiga las cartas
  fetchData();
}

async function fetchData() {
  try {
    //trear la data del json
    const response = await fetch("./data.json");
    const json = await response.json(); //transformar la data a algo legible
    let data = json.imagenes; //gurdarlo en una variable

    let randomCard;
    let filteredArray = [];

    //todo mientras la cantidad de cartas sea menor al numero ingresado por el usuario
    do {
      //toma un objeto aleatorio del array data
      randomCard = data[Math.floor(Math.random() * data.length)];

      //si el id no coincide con un id que ya haya salido
      let repitedCard = filteredArray.find((elem) => elem.id == randomCard.id);

      //entonces se agrega a filteredArray
      if (!repitedCard) {
        filteredArray.push(randomCard);
      }
    } while (filteredArray.length < numberOfCards);

    //se duplica el array de cartas random
    let duplicatedArray = [...filteredArray, ...filteredArray];

    //se ordena aleatoriamente
    let shuffledArray = duplicatedArray.sort(() => Math.random() - 0.5);

    //se muestran las cartas filtradas, duplicadas y ordenadas
    shuffledArray.forEach((item, index) => {
      cardsWrapper.innerHTML += `
        <button onclick="cardSelected(${index})" class="card" id="card-${index}"">   
            <img class="" src="${item.url}" alt="${item.nombre}" />
        </button>
        `;
    });

    //define los segundos que se muestran las cartas dependiendo de la cantidad
    if (numberOfCards <= 4) {
      time = 3;
    } else if (numberOfCards >= 5 && numberOfCards <= 6) {
      time = 4;
    } else if (numberOfCards >= 7 && numberOfCards <= 8) {
      time = 5;
    } else {
      time = 6;
    }

    //estilo inicial de las cartas, se quita luego de que pasan los segundos de variable time
    shuffledArray.forEach((_, index) => {
      const btnCard = document.getElementById(`card-${index}`);
      const cardImg = document.querySelector(`#card-${index} img`);

      setTimeout(() => {
        cardImg.classList.add("hidden");
        btnCard.style.backgroundColor = "rgb(146, 236, 232)";
        allBtn.forEach((btn) => {
          btn.disabled = true;
        });
      }, time * 1000);
    });

    //contador en reversa
    setInterval(() => {
      if (time > 0) {
        time--;
        timeBox.textContent = time;
      } else if (time == 0) {
        timeBox.textContent = "";
      }
    }, 1000);

    return shuffledArray;
  } catch (error) {
    console.error(error);
  }
}

let selectedName = [];
let selectedHtml = [];
let correctPairs = [];

function cardSelected(index) {
  const allBtn = document.querySelectorAll(".card");
  const btnCard = document.getElementById(`card-${index}`);
  const cardImg = document.querySelector(`#card-${index} img`);

  //al seleccionar la carta le cambia el display y color
  cardImg.classList.remove("hidden");
  btnCard.style.backgroundColor = "white";

  //se agregan las cartas seleccionadas a los arrays vacios mientras sen menos a 2
  if (selectedName.length < 2) {
    selectedName.push(cardImg.alt); //solo el nombre
    selectedHtml.push({ btnCard, cardImg }); //el html (<button> e <img>)
  }

  //si el array tiene 2 elemmtos
  if (selectedName.length == 2) {

    //se bloquean todos los botones
    allBtn.forEach((btn) => {
      btn.disabled = true;
    });

    //si el ambos elemntos tienen el mismo nombre
    if (selectedName[0] === selectedName[1]) {
      //se agregan al arreglo que guarda los pares correctos
      correctPairs.push(...[selectedName[0], selectedName[1]]); //solo nombres

      //por cada elemento html se le cambia el display, color y se bloquea el btn
      selectedHtml.forEach((item) => {
        item.cardImg.classList.remove("hidden");
        item.btnCard.style.backgroundColor = "white";
        item.btnCard.disabled = true;
      });

      //  Desbloquear solo las cartas que no están en correctPairs
      allBtn.forEach((btn) => {
        //btn.firstElementChild.alt: corresponde al nombre de cada card
        //!correctPairs.includes(...) si el nombre de la carta NO esta en correctPairs se cumple el if
        if (!correctPairs.includes(btn.firstElementChild.alt)) {
          btn.disabled = false; //se desbloquean los btn que no estan en correctPairs
        }
      });

      //liampiar los arrays
      selectedHtml = [];
      selectedName = [];

    } else {
      setTimeout(function () {
        selectedHtml.forEach((item) => {
          item.cardImg.classList.remove("show");
          item.cardImg.classList.add("hidden");
          item.btnCard.style.backgroundColor = "rgb(146, 236, 232)";
          selectedHtml = [];
        });

        // Desbloquear solo las cartas que no están en correctPairs
        allBtn.forEach((btn) => {
          if (!correctPairs.includes(btn.firstElementChild.alt)) {
            btn.disabled = false;
          }
        });
        
      }, 1000);

      selectedName = [];
    }
  }

  //si el array de correctos es igual al numero ingresado por el usuario * 2
  if (correctPairs.length === numberOfCards * 2) {
    //pasado 1s se cambian los estilos de la seccion container y modal
    setTimeout(() => {
      container.classList.remove("show");
      container.classList.add("hidden");

      modalResultado.classList.add("show");
    }, 1000);
  }
}

function nuevoJuego() {
  correctPairs = []; //limpiar el array
  cardsWrapper.innerHTML = ""; //limpiar el html
  document.getElementById("num-of-cards").value = ""; //liampiar el input

  //modificar el estilo de seccion modal
  modalResultado.classList.remove("show");
  modalResultado.classList.add("hidden");

  //escoonde la seccion inicio
  inicioJuego.classList.remove("hidden");
}

//ver si puedo agregar animaciones a las cartas con css
