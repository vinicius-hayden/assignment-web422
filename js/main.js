let page = 1;
const perPage = 10;
let searchName = null;
const tbody = document.querySelector('tbody');
const currentPage = document.getElementById('currentPage');
const modalBody = document.querySelector('.modal-body');
const modalTitle = document.querySelector('.modal-title');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');
const searchButton = document.getElementById('search');
const clearButton = document.getElementById('clearValue');

function loadListingsData() {
  let url = `https://assignment-web422.vercel.app/api/listings?page=${page}&perPage=${perPage}`;
  if (searchName) {
    url += `&name=${searchName}`;
  }

  fetch(url)
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      if (data.length) {
        tbody.innerHTML = data.map(listing => `
          <tr data-id="${listing._id}">
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address.street}</td>
            <td>
              ${listing.summary}<br><br>
              <strong>Accommodates:</strong> ${listing.accommodates}<br>
              <strong>Rating:</strong> ${listing.review_scores?.review_scores_rating || 'N/A'} (${listing.number_of_reviews} Reviews)
            </td>
          </tr>
        `).join('');

        currentPage.innerText = page;

        document.querySelectorAll('#listingsTable tr').forEach(row => {
          row.addEventListener('click', () => {
            const listingId = row.getAttribute('data-id');
            fetch(`https://assignment-web422.vercel.app/api/listings/${listingId}`)
              .then(res => res.ok ? res.json() : Promise.reject(res.status))
              .then(data => {
                if (data) {
                  modalTitle.innerText = data.name;
                  const pictureUrl = data.images && data.images.picture_url ? data.images.picture_url : 'https://placehold.co/600x400?text=Photo+Not+Available';
                  modalBody.innerHTML = `
                    <img id="photo" class="img-fluid w-100" src="${pictureUrl}" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'">
                    <br><br>${data.neighborhood_overview || ''}<br><br>
                    <strong>Price:</strong> ${data.price.toFixed(2)}<br>
                    <strong>Room:</strong> ${data.room_type}<br>
                    <strong>Bed:</strong> ${data.bed_type} (${data.beds})<br><br>
                    `;

                  const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
                  detailsModal.show();
                }
              });
          });
        });
      } else {
        if (page > 1) {
          page--;
        } else {
          tbody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
        }
      }
    })
    .catch(err => {
      tbody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  
  previousPage.addEventListener('click', () => {
    if (page > 1) {
      page--;
      loadListingsData();
    }
  });

  nextPage.addEventListener('click', () => {
    page++;
    loadListingsData();
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchName = document.getElementById('name').value;
    console.log(document.getElementById('name').value);
    console.log(searchName);
    page = 1;
    loadListingsData();
  });

  clearButton.addEventListener('click', () => {
    document.getElementById('name').value = "";
    searchName = null;
    page = 1;
    loadListingsData();
  });

  loadListingsData()

});