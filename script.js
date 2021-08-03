const btnAdd = document.querySelector(".add");

const modalWrapper = document.querySelector(".modal-wrapper");

const addModal = document.querySelector(".add-modal");

const addModalForm = document.querySelector(".add-modal .form");

const editModal = document.querySelector(".edit-modal");

const editModalForm = document.querySelector(".edit-modal .form");

const tableProducts = document.querySelector(".table-products");

const searchBar = document.getElementById("searchBar");

let id;

const renderProduct = (doc) => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().productCode}</td>
      <td>${doc.data().productName}</td>
      <td>${doc.data().categoryName}</td>
      <td>${doc.data().brandName}</td>
      <td>${doc.data().productPrice}</td>
      <td>
          <button class="btn edit">Edit</button>
          <button class="btn delete">Delete</button>
      </td>
    </tr>
  `;
  tableProducts.insertAdjacentHTML("beforeend", tr);

  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .edit`);
  btnEdit.addEventListener("click", () => {
    editModal.classList.add("modal-show");

    id = doc.id;
    editModalForm.productCode.value = doc.data().productCode;
    editModalForm.productName.value = doc.data().productName;
    editModalForm.categoryName.value = doc.data().categoryName;
    editModalForm.brandName.value = doc.data().brandName;
    editModalForm.productPrice.value = doc.data().productPrice;
  });

  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .delete`);
  btnDelete.addEventListener("click", () => {
    db.collection("products")
      .doc(`${doc.id}`)
      .delete()
      .then(() => {
        console.log("Document succesfully deleted!");
      })
      .catch((err) => {
        console.log("Error removing document", err);
      });
  });


                  //SEARCH BAR DENEMELERİ
  // let filterInput = document.getElementById("searchBar");

  // filterInput.addEventListener("keyup", function () {
  //   let filterValue = document.getElementById("searchBar").value;
  //   var table = document.getElementById("tableproducts");
  //   let tr = table.querySelectorAll("tr");

  //   for (let index = 0; index < tr.length; index++) {
  //     let val = tr[index].getElementsByTagName('td')[0];
  //     if (val.innerHTML.indexOf(filterValue) > -1) {
  //       tr[index].style.display = "";
  //     } else {
  //       tr[index].style.display = "none";
  //     }
  //   }
  // });

  // console.log(filterInput[0])


  // const searchInput = document.getElementById("searchBar");
  // const rows = document.querySelectorAll("tbody tr");
  // console.log(rows);
  // searchInput.addEventListener("keyup", function (event) {
  //   const q = event.target.value.toLowerCase();
  //   rows.forEach((row) => {
  //     row.querySelector("td").textContent.toLowerCase().startsWith(q)
  //       ? (row.style.display = "table-row")
  //       : (row.style.display = "none");
  //   });
  // });
};

btnAdd.addEventListener("click", () => {
  addModal.classList.add("modal-show");

  addModalForm.productCode.value = "";
  addModalForm.productName.value = "";
  addModalForm.categoryName.value = "";
  addModalForm.brandName.value = "";
  addModalForm.productPrice.value = "";
});

window.addEventListener("click", (e) => {
  if (e.target === addModal) {
    addModal.classList.remove("modal-show");
  }
  if (e.target === editModal) {
    editModal.classList.remove("modal-show");
  }
});

//DENEME 1
// console.log(searchBar)
// searchBar.addEventListener('keyup', (e) => {
//   const searchString = e.target.value;
//   const filteredProducts = products.filter(product => {
//     return product.productName.contain(searchString);
//   });
//   console.log(filteredProducts);
// });


db.collection("products").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderProduct(change.doc);
    }
    if (change.type === "removed") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableProducts.removeChild(tbody);
    }
    if (change.type === "modified") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableProducts.removeChild(tbody);
      renderProduct(change.doc);
    }
  });
});

//DENEME 3
// let filterInput = document.getElementById('filter');

// filterInput.addEventListener('keyup', function(){
//   let filterValue = document.getElementById('filter').value;
//   var table = document.getElementById('table-products');
//   let tr = table.querySelector('tr')

//   for (let index = 0; index< tr.length;index++ ){
//     let val = tr[index].getElementByTagName('td')[0];
//     if (val.innerHTML.indexOf(filterValue)>-1){
//       tr[index].style.display = '';
//     }else{
//       tr[index].style.display= 'none';
//     }

//   };

// });

addModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("products").add({
    productCode: addModalForm.productCode.value,
    productName: addModalForm.productName.value,
    categoryName: addModalForm.categoryName.value,
    brandName: addModalForm.brandName.value,
    productPrice: addModalForm.productPrice.value,
  });
  modalWrapper.classList.remove("modal-show");
});

editModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("products").doc(id).update({
    productCode: editModalForm.productCode.value,
    productName: editModalForm.productName.value,
    categoryName: editModalForm.categoryName.value,
    brandName: editModalForm.brandName.value,
    productPrice: editModalForm.productPrice.value,
  });
  editModal.classList.remove("modal-show");
});
