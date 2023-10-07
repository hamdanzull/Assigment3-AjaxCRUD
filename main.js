const result = document.getElementById("result");

const url = "http://localhost:3000/data";
const xhr = new XMLHttpRequest();

// Create currency formatter
const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
});

// GET All
function fetchData() {
    xhr.onerror = function () {
        alert("Error!")
    }

    xhr.onloadstart = function () {
        result.innerHTML = "Loading..";
    }

    xhr.onloadend = function () {
        result.innerHTML = "";
        const data = JSON.parse(this.response);

        for (let i = 0; i < data.length; i++) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data[i].id}</td>
                <td>${data[i].title}</td>
                <td>${currency.format(data[i].price)}</td>
                <td>
                    <img style="height: 75px;" src="${data[i].img}">
                </td>
                <td>
                    <button class="btn btn-success pb-2" data-bs-toggle="modal"
                    data-bs-target="#detailModal" onclick="fetchDetail(${data[i].id})">
                        <img style="height: 15px;" src="assets/eye.svg">
                    </button>

                    <button class="btn btn-warning pb-2" data-bs-toggle="modal"
                    data-bs-target="#editBook" onclick="editItem(${data[i].id})">
                        <img style="height: 15px;" src="assets/pen.svg">
                    </button>

                    <button class="btn btn-danger pb-2" onclick="deleteData(${data[i].id})">
                        <img style="height: 15px;" src="assets/trash.svg">
                    </button>
                </td>
            `
            result.appendChild(row);
        }
    }

    xhr.onprogress = function () {
        result.innerHTML = "Loading..";
    }

    xhr.open("GET", url);
    xhr.send();
}

// EDIT
function editItem(id) {
    console.log(id);
    const item = document.getElementById('item');

    xhr.onload = function () {
        console.log(this);
        item.innerHTML = ""
        const data = JSON.parse(this.response);
        item.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title" id="editBookLabel">Edit Buku</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" >
        <form class="mb-3">
            <div class="mb-3">
              <label for="title" class="form-label">Judul Buku</label>
              <input type="text" class="form-control" id="editTitle" value="${data[id - 1].title}">
            </div>
            <div class="mb-3">
                <label for="price" class "form-label">Harga</label>
                <input type="text" class="form-control" id="editPrice" value="${data[id - 1].price}">
            </div>
            <div class="mb-3">
                <label for="img" class="form-label">Gambar</label>
                <input type="text" class="form-control" id="editImg" value="${data[id - 1].img}">
            </div>
            <div class="mb-3">
                <label for="desc" class="form-label">Deskripsi</label>
                <textarea class="form-control" rows="5" id="editDesc">${data[id - 1].description}</textarea>
            </div>
        </form>
        </div>
        
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <!-- saveChanges() -->
            <button onclick="saveChanges(${id})" type="submit" class="btn btn-primary">Simpan</button>
        </div>
        `
    }

    xhr.open("GET", url);
    xhr.send();
}

function saveChanges(id) {
    const data = JSON.stringify({
        title: document.getElementById("editTitle").value,
        price: document.getElementById("editPrice").value,
        img: document.getElementById("editImg").value,
        description: document.getElementById("editDesc").value
    });

    xhr.open("PUT", url + `/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);

}

// POST
function postData(event) {
    event.preventDefault();
    const data = JSON.stringify({
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        description: document.getElementById("desc").value
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        console.log(this.responseText);
    };

    xhr.send(data);
}

// DELETE
function deleteData(id) {
    xhr.open("DELETE", url + `/${id}`);
    xhr.send();
}

// replace \n menjadi <br> untuk description
function newBr(inputString) {
    return inputString.replace(/\n/g, '<br>');
}

// GET BY ID
function fetchDetail(id) {
    xhr.onload = function () {
        result.innerHTML = "";
        const data = JSON.parse(this.response);
        const info = document.getElementById("info");
        info.innerHTML = `
            <img style="width: 200px;" src="${data[id - 1].img}">
            <div style="margin-left: 15px;">
                <h5>${data[id - 1].title}</h5>
                <h6>${currency.format(data[id - 1].price)}</h6>
                <p class="fw-bold mb-1">Deskripsi</p>
                <p>${newBr(data[id - 1].description)}</p>
            </div>`;

    }

    xhr.onloadstart = function () {
        info.innerHTML = "Loading..";
    }

    xhr.onprogress = function () {
        info.innerHTML = "Loading..";
    }

    xhr.open("GET", url);
    xhr.send();
}




