const URL = 'https://japceibal.github.io/japflix_api/movies-data.json'
const data = await getData(URL)
const $ = selector => document.querySelector(selector)
const $input = $('.form-control')
const $ul = $('#lista')
const $search = $('#btnBuscar')

function getData(url) {
    return fetch(url).then(res => res.json()).then(data => data)
}

let filteredData = []

$input.addEventListener('input', 
  debounce(() => {
    const query = $input.value.toLowerCase()
    const filter = data.filter(item => (
      item.title.toLowerCase().includes(query) ||
      item.overview.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.genres.some(genre => genre.name.toLowerCase().includes(query))
    ))

    filteredData = filter.length > 0 ? [...filter] : "No se encontró la película"
  }, 500)
)

$search.addEventListener('click', () => {
  $ul.innerHTML = ''

  if (!Array.isArray(filteredData)) {
    const li = document.createElement('li')
    li.textContent = filteredData
    li.style.color = 'red' 
    $ul.appendChild(li)
  } else {
    filteredData.forEach(movie => $ul.appendChild(movieCard({ movie })))
  }
})




function debounce(fn, ms = 300) {
  let timer

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}

function stars({filledStars, emptyStars}){
    const starsContainer = document.createElement('div')
    starsContainer.classList.add('stars-container')
    
    for(let i = 0; i < filledStars; i++){
        const star = document.createElement('span')
        star.classList.add('fa', 'fa-star', 'checked')
        starsContainer.appendChild(star)
    }

    for(let i = 0; i < emptyStars; i++){
        const star = document.createElement('span')
        star.classList.add('fa', 'fa-star')
        starsContainer.appendChild(star)
    }
    
    return starsContainer
}




function movieCard({movie}) {
    const container = document.createElement('li')
    const div = document.createElement('div')
    const title = document.createElement('h2')
    const tagLine = document.createElement('small')
    const filledStars = Math.round(movie.vote_average / 2)
    const emptyStars = Math.round(5 - filledStars)
    
    title.textContent = movie.title
    tagLine.textContent = movie.tagline
    div.appendChild(title)
    div.appendChild(tagLine)
    container.appendChild(div)
    container.appendChild(stars({filledStars, emptyStars}))
    container.style = 'cursor: pointer'
    container.addEventListener('click', () => {
        showModal({movie})
    })
    return container

}


function showModal({ movie }) {
  const modalHTML = `
    <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel" style="display: flex">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasTopLabel">${movie.title || 'Sin título'}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body" style="position: relative; overflow: visible" >
        ${movie.overview || 'Sin descripción'}
        <br><br>
        <div style="display: flex; gap: 10px">
          ${movie.genres.map(genre => `<span class="badge text-dark p-2">${genre.name}</span>`).join(' ')}
           <div class="dropdown ms-auto ">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              More
            </button>
            <ul class="dropdown-menu" style="position: absolute !important; z-index: 100 !important">
              <li><a class="dropdown-item" href="#">Year: ${movie.release_date.split('-')[0]}</a></li>
              <li><a class="dropdown-item" href="#">Runtime:${movie.runtime} mins</a></li>
              <li><a class="dropdown-item" href="#">Budget: $${movie.budget}</a></li>
              <li><a class="dropdown-item" href="#">Revenue: $${movie.revenue}</a></li>
            </ul>
          </div>
        </div>
      </div>
     
    </div>
  `;
    
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const offcanvasEl = document.getElementById('offcanvasTop');

  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
  bsOffcanvas.show();

  offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
    offcanvasEl.remove();
  });
}




