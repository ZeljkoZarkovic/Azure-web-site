Fetch();


var b1 = document.getElementById('b1');
b1.addEventListener('click', function () {
    var inputContainer = document.getElementById('sd');

    var overlay = document.getElementById('overlay');


    inputContainer.style.display = 'block';
    inputContainer.style.top = '25%';
    overlay.style.display = 'block';

})



var fb = document.querySelector('#fb')
fb.addEventListener("submit", (e) => {
    e.preventDefault();

    var ime = document.querySelector('#Ime').value
    var email = document.querySelector('#E-mail').value
    var naslov = document.querySelector('#Naslov').value
    var opis = document.querySelector('#Opis').value
    var datum = new Date()
    let data = {
        ime: ime,
        email: email,
        naslov: naslov,
        opis: opis,
        datum: datum.getDate() + "/" + (datum.getMonth() + 1) + "/" + datum.getFullYear(),
        komentari: []



    }
    fetch('http://localhost:3000/Klijenti', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })



})

var sr = document.getElementById('sr');

sr.addEventListener("input", e => {
    var value = e.target.value.toLowerCase();
    fetch('http://localhost:3000/Klijenti')
        .then(response => response.json())
        .then(Data => {
            var cont = document.getElementById('red');
            var tmp = '';
            let Sorted = [];
            Data.forEach(kl => {
                if (kl.naslov.toLowerCase().includes(value))
                    Sorted.push(kl);
            });
            Sorted.reverse();

            Sorted.forEach(Dat => {
                tmp += CardMakeup(Dat);
            })
            cont.innerHTML = tmp;
            let tmpDiv = cont.querySelectorAll("#cr");


            Pagination1(tmpDiv);
        })


})


function Fetch() {
    fetch('http://localhost:3000/Klijenti')
        .then(response => response.json())
        .then(Data => {

            console.log(Data);
            var cont = document.getElementById('red');
            var tmp = '';
            let Sorted = [];
            Data.forEach(kl => {
                Sorted.push(kl);
            });
            Sorted.reverse();

            Sorted.forEach(Dat => {
                tmp += CardMakeup(Dat);
            })


            cont.innerHTML = tmp;
            let tmpDiv = cont.querySelectorAll("#cr");
            Pagination(tmpDiv);
            tmpDiv.forEach(function (div) {
                let dug = div.querySelector("#dodaj_komentar");

                dug.addEventListener('submit', (e) => {
                    e.preventDefault();
                    var id = div.getAttribute('index');
                    fetch(`http://localhost:3000/Klijenti/${id}`)
                        .then(response => response.json())
                        .then(Data => {
                            var ime = div.querySelector('#Ime1').value
                            var email = div.querySelector('#E-mail1').value
                            var opis = document.querySelector('#Opis1').value
                            let data1 = {
                                ime: ime,
                                email: email,
                                opis: opis
                            }
                            Data.komentari.push(data1);
                            console.log(Data);




                            fetch(`http://localhost:3000/Klijenti/${id}`, {
                                method: 'PATCH',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(Data)
                            })
                        })

                })
                let kom = div.querySelector("#kom");
                console.log(kom);
                kom.addEventListener('click', function () {
                    if (div.querySelector('#com').style.display == 'flex') {
                        div.querySelector('#com').style.display = 'none';
                    } else {
                        div.querySelector('#com').style.display = 'flex';
                    }
                    if (div.querySelector('#com1').style.display == 'block') {
                        div.querySelector('#com1').style.display = 'none';
                    } else {
                        div.querySelector('#com1').style.display = 'block';
                    }


                })
            })
        })



}

function Pagination(tmpDiv) {



    const pageNumbers = document.querySelector(".pageNumbers");
    console.log(pageNumbers)
    const listItems = tmpDiv;
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");


    const contentLimit = 3;
    const pageCount = Math.ceil(listItems.length / contentLimit);
    let currentPage = 1;

    function displayPageNumbers(index) {
        const pageNumber = document.createElement("a");
        pageNumber.innerText = index;
        pageNumber.setAttribute('href', "#");
        pageNumber.setAttribute("index", index);
        pageNumbers.appendChild(pageNumber);
    }

    const getPageNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
            displayPageNumbers(i);
        };
    };

    const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    };

    const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };

    const controlButtonsStatus = () => {
        if (currentPage == 1) {
            disableButton(prevButton);
        }
        else {
            enableButton(prevButton);
        }
        if (pageCount == currentPage) {
            disableButton(nextButton);
        }
        else {
            enableButton(nextButton);
        }
    };

    const handleActivePageNumber = () => {
        document.querySelectorAll('a').forEach((button) => {
            button.classList.remove("active");
            const pageIndex = Number(button.getAttribute("index"));
            if (pageIndex == currentPage) {
                button.classList.add('active');
            }
        });
    };

    const setCurrentPage = (pageNum) => {
        currentPage = pageNum;

        handleActivePageNumber();
        controlButtonsStatus();

        const prevRange = (pageNum - 1) * contentLimit;
        const currRange = pageNum * contentLimit;

        listItems.forEach((item, index) => {
            item.style.display = 'none';
            if (index >= prevRange && index < currRange) {
                item.style.display = 'flex';
            }
        });
    };

    getPageNumbers();
    setCurrentPage(1);

    prevButton.addEventListener('click', () => {
        setCurrentPage(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll('a').forEach((button) => {
        const pageIndex = Number(button.getAttribute('index'));

        if (pageIndex) {
            button.addEventListener('click', () => {
                setCurrentPage(pageIndex);
            });
        };
    });

}

function CardMakeup(card) {
    return `
  <div class="card mb-3" id="cr" index=${card.id}>
        <span style="align-items: center; display: flex; padding-left: 20px;"><i class="fa-solid fa-user" style="font-size: 50px;"></i></span>
        <div id="card-body" class="card-body" >
          <h5 id="card-title" class="card-title">Ime i prezime: ${card.ime}</h5>
          <p class="card-text">E-mail: ${card.email}</p>
          <h5 id="card-title">Naslov: ${card.naslov}</h5> 
          
          <p class="card-text">Opis: <br>${card.opis}</p>
          
          <div id="card-footer" class="card-footer d-flex justify-content-between allignt-items-center">
           <div>Postavljeno ${card.datum}</div><span id="kom"> <i id="fa-com" class="fa-solid fa-comments"></i></span> 
          </div>
          <section id="com1">
            ${Komentar(card.komentari)}
          </section>
          

<div class="card" id="com" >
  <div class="card-body">
  <form id="dodaj_komentar">
  <Label>Ime i prezime:</Label>
  <input class="in"   type="text" id="Ime1" required>
  <Label>E-mail:</Label>
  <input class="in" type="email" id="E-mail1"  placeholder="@example.com" required>
  <label>Odgovor:</label>
            <textarea class="in" id="Opis1" required></textarea>
            <div id="btn">
            <button id="b1" class="btn btn-primary">Odgovori</button>
            </div>
    </form>        
  </div>
</div>

          
    </div>
</div>
  
  
  `

}
function Pagination1(tmpDiv) {


    var Remove = document.querySelector('.pageNumbers')
    var Anchor = Remove.querySelectorAll("a");
    for (var i = 0; i < Anchor.length; i++) {
        var anchor = Anchor[i];
        anchor.parentNode.removeChild(anchor);
    }

    const pageNumbers = document.querySelector(".pageNumbers");
    const listItems = tmpDiv;
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");


    const contentLimit = 3;
    const pageCount = Math.ceil(listItems.length / contentLimit);
    let currentPage = 1;

    function displayPageNumbers(index) {
        const pageNumber = document.createElement("a");
        pageNumber.innerText = index;
        pageNumber.setAttribute('href', "#");
        pageNumber.setAttribute("index", index);
        pageNumbers.appendChild(pageNumber);
    }

    const getPageNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
            displayPageNumbers(i);
        };
    };

    const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    };

    const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };

    const controlButtonsStatus = () => {
        if (currentPage == 1) {
            disableButton(prevButton);
        }
        else {
            enableButton(prevButton);
        }
        if (pageCount == currentPage) {
            disableButton(nextButton);
        }
        else {
            enableButton(nextButton);
        }
    };


    const handleActivePageNumber = () => {
        document.querySelectorAll('a').forEach((button) => {
            button.classList.remove("active");
            const pageIndex = Number(button.getAttribute("index"));
            if (pageIndex == currentPage) {
                button.classList.add('active');
            }
        });
    };


    const setCurrentPage = (pageNum) => {
        currentPage = pageNum;

        handleActivePageNumber();
        controlButtonsStatus();

        const prevRange = (pageNum - 1) * contentLimit;
        const currRange = pageNum * contentLimit;

        listItems.forEach((item, index) => {
            item.style.display = 'none';
            if (index >= prevRange && index < currRange) {
                item.style.display = 'flex';
            }
        });
    };

    getPageNumbers();
    setCurrentPage(1);

    prevButton.addEventListener('click', () => {
        setCurrentPage(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll('a').forEach((button) => {
        const pageIndex = Number(button.getAttribute('index'));

        if (pageIndex) {
            button.addEventListener('click', () => {
                setCurrentPage(pageIndex);
            });
        };
    });



}
function Komentar(komentari) {
    if (komentari == '') {
        return '<div class="card-body">Nema komentara!</div>'
    }

    var tmp = '';
    for (let k of komentari) {
        tmp += `<div id="mini" class="card">
        <div class="card-body">
              Ime i prezime: ${k.ime} <br>
              Email: ${k.email} <br>
              Odgovor: <br> ${k.opis}
        </div>
      </div>`
    }
    return tmp



}

var exit = document.querySelector('#exit');
exit.addEventListener('click', () => {
    var inputContainer = document.getElementById('sd');

    var overlay = document.getElementById('overlay');


    inputContainer.style.display = 'none';
    inputContainer.style.top = '0%';
    overlay.style.display = 'none';

})
