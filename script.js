const loadAllPets = async (category, sort = false) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/${
      category ? category : "pets"
    }`
  );
  const data = await res.json();

  let pets = category ? data.data : data.pets;

  if (sort) {
    pets.sort((a, b) => b.price - a.price);
  }

  displayAllPets(pets);
};

const displayAllPets = (pets) => {
  const showCardContainer = document.getElementById("show-pet-cards");

  showCardContainer.innerHTML = `
    <div class="flex justify-center items-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  `;
  showCardContainer.classList.remove("grid");

  setTimeout(() => {
    if (pets.length === 0) {
      showCardContainer.classList.remove("grid");
      showCardContainer.innerHTML = `
        <div class="space-y-6 mx-auto my-20">
          <div class="">
            <img class="w-[150px] mx-auto" src="images/error.webp" alt="" />
          </div>
          <div class="text-center md:w-7/12 mx-auto space-y-4">
            <h2 class="text-3xl font-bold">No Information Available</h2>
            <p class="text-[rgba(19,19,19,0.7)]">
              It is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point of using
              Lorem Ipsum is that it has a.
            </p>
          </div>
        </div>
      `;
      return;
    }

    showCardContainer.classList.add("grid");
    showCardContainer.innerHTML = "";
    pets.forEach((pet) => {
      const { breed, date_of_birth, image, gender, price, pet_name, petId } =
        pet;

      const div = document.createElement("div");
      div.innerHTML = `
        <div class="border p-5 rounded-xl">
            <div>
              <img class="rounded-xl w-full" src="${image}" alt="" />
            </div>
            <h5 class="text-xl font-bold mt-5">${pet_name}</h5>
            <p class="text-[rgba(19,19,19,0.7)]"> <i class="fa-brands fa-squarespace"></i> Breed: ${
              breed || "Not mentioned"
            }</p>
            <p class="text-[rgba(19,19,19,0.7)]"> <i class="fa-solid fa-cake-candles"></i> Birth: ${
              date_of_birth || "Not available"
            } </p>
            <p class="text-[rgba(19,19,19,0.7)]"> <i class="fa-solid fa-mercury"></i> Gender: ${
              gender || "Unknown"
            }</p>
            <p class="text-[rgba(19,19,19,0.7)]"> <i class="fa-solid fa-dollar-sign"></i> Price : ${
              price || "Not given"
            }</p>

            <hr class="my-3" />

            <div class="flex justify-between gap-2">
              <div class="">
                <i onclick="showImage('${image}')"
                  class="fa-regular fa-thumbs-up border py-2 px-6 rounded-lg text-xl hover:bg-[#D3D3D3]"
                ></i>
              </div>
              <button id='adopt-${petId}' onclick="showCountDown('${petId}')" class="border py-2 px-5 rounded-lg text-[#0E7A81] font-bold  hover:bg-[#D3D3D3]">
                Adopt
              </button>
              <button id='details-${petId}' onclick="loadDetails('${petId}')"  class="border py-2 px-4 rounded-lg text-[#0E7A81] font-bold hover:bg-[#D3D3D3]">
                Details
              </button>
            </div>
          </div>
      `;

      showCardContainer.appendChild(div);
    });
  }, 2000);
};

const showImage = (img) => {
  //   console.log(img);
  const showImageContainer = document.getElementById("showImageContainer");
  //   console.log(showImageContainer);

  const div = document.createElement("div");
  div.innerHTML = `
    <div class="border p-1 rounded-xl">
            <img class="object-cover w-full h-full rounded-xl" src="${img}" alt="" />
          </div>
`;

  showImageContainer.appendChild(div);
};

const findCategory = async () => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/categories`
  );

  const data = await res.json();
  displayCategory(data.categories);
};

const displayCategory = (categories) => {
  //   console.log(categories);

  const categoriesContainer = document.getElementById("category-part");
  //   console.log(categoriesContainer);

  categories.forEach((categoryAll) => {
    // console.log(category);

    const { category, category_icon } = categoryAll;

    const div = document.createElement("div");
    div.innerHTML = `
      <div id='category-${category}' onclick="showByCategory('${category}')" class="border py-3 px-6 rounded-lg flex items-center justify-center  gap-3 category-div">
            <h6><img class="" src="${category_icon}" alt=""></h6>
            <h3 class="text-xl font-extrabold">${category}</h3>

      </div>
  `;

    categoriesContainer.appendChild(div);
  });
};

const showByCategory = (category) => {
  // console.log(category);

  removeActiveDivClass();

  const activeDiv = document.getElementById(`category-${category}`);
  // console.log(activeDiv);
  activeDiv.classList.add("active-div");

  const str = `category/${category.toLowerCase()}`;

  loadAllPets(str);
};

document.getElementById("sortByPriceId").addEventListener("click", () => {
  loadAllPets(null, true);
});

const removeActiveDivClass = () => {
  const divs = document.getElementsByClassName("category-div");
  // console.log(divs);

  for (const div of divs) {
    div.classList.remove("active-div", "rounded-lg");
  }
};

const showCountDown = (id) => {
  const modal = document.getElementById("adopt_modal_5");
  const countDownDiv = document.getElementById("countDownDiv");
  let countDown = 3;
  countDownDiv.innerHTML = `<p class="text-4xl font-extrabold">${countDown}</p>`;

  modal.showModal();

  const interval = setInterval(() => {
    countDown--;
    countDownDiv.innerHTML = `<p class="text-4xl font-extrabold">${countDown}</p>`;

    if (countDown === 0) {
      modal.close();
      clearInterval(interval);
    }
  }, 1000);

  // console.log(id);
  const adoptId = document.getElementById(`adopt-${id}`);
  // console.log(adoptId);

  adoptId.textContent = "adopted";
  adoptId.style.backgroundColor = "#D3D3D3";
  adoptId.style.color = "#808080";
  adoptId.disabled = true;
};

const loadDetails = async (id) => {
  // console.log("trying to load details");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${id}`
  );
  const data = await res.json();
  showDetails(data.petData);
};

const showDetails = (pet_information) => {
  // console.log(pet_information);

  const {
    breed,
    date_of_birth,
    image,
    gender,
    price,
    pet_name,
    pet_details,
    vaccinated_status,
  } = pet_information;

  const detailsModal = document.getElementById("details_modal_5");
  // console.log(detailsModal);

  const detailsContainer = document.getElementById("detailsLoaderId");
  // console.log(detailsContainer);
  detailsContainer.innerHTML = `
      <div>
        <img class="rounded-lg w-full" src="${image}" alt="">
      </div>
      
      <div>
        <h3 class="text-2xl font-bold mb-3">${pet_name}</h3>
        <div class="w-11/12 flex lg:flex-row flex-col lg:gap-4 justify-center lg:space-y-3">
          
          <div class="md:w-7/12">
            <p class="text-[rgba(19,19,19,0.7)]">
               <i class="fa-brands fa-squarespace"></i> Breed: ${
                 breed || "Not mentioned"
               }
            </p>
            <p class="text-[rgba(19,19,19,0.7)]">
               <i class="fa-solid fa-mercury"></i> Gender: ${
                 gender || "Unknown"
               }
            </p>
            <p class="text-[rgba(19,19,19,0.7)]">
               <i class="fa-solid fa-syringe"></i> Vaccinated status: ${
                 vaccinated_status || "Unrevealed"
               }
            </p>
          </div>

          <div class="md:w-5/12">
            <p class="text-[rgba(19,19,19,0.7)]">
               <i class="fa-solid fa-dollar-sign"></i> Price : ${
                 price || "Not given"
               }
            </p>
            <p class="text-[rgba(19,19,19,0.7)]">
               <i class="fa-solid fa-cake-candles"></i> Birth: ${
                 date_of_birth || "Not available"
               }
            </p>
          </div>
          
        </div>
      </div>

      <hr class="my-3" />

      <div>
        <h3 class="text-xl font-bold  mb-3">Details Information</h3>
        <p class="text-[rgba(19,19,19,0.7)]">
          ${pet_details}
        </p>
      </div>
  `;

  detailsModal.showModal();

  const cancleBtn = document.getElementById("cancleBtn");
  // console.log(cancleBtn);

  cancleBtn.addEventListener("click", () => {
    detailsModal.close();
  });
};

findCategory();

loadAllPets();
