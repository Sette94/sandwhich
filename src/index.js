//1. Statz's code: Index.js : Rendering the the sandwiches at the top of the page. 
//1. Fetch call to the db.json and parsing out all of the data.

//2. Nick's Code: Index.js: Rendering the ingredients through click events 

//1.1 Getting ID's to render the images
const sandwichMenu = document.getElementById('menu')
const ingredientsList = document.getElementById('ingredients')
const focusedSandwich = document.getElementById('focusedSandwich')


//1.2 Function to create images
function createSandwichImage(sandwich) {
    const img = document.createElement('img')
    img.src = sandwich.url
    img.classList.add('sandwich-image') //Add a CSS class to the img element
    img.setAttribute('data-id', sandwich.id); // Set the data-id attribute to store the sandwich id

    img.addEventListener(
        'mouseenter',
        (event) => {
            event.target.classList.add('enlarge')

        }
    );

    sandwichMenu.appendChild(img) //Append the created img element to the sandwichMenu div
}

sandwichMenu.addEventListener('click', (e) => {
    const clickedImg = e.target;
    const sandwichId = clickedImg.getAttribute('data-id'); // Get the value of the data-id attribute
    






    const sandwichForm = document.getElementById('sandwichForm');
    sandwichForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log(event.target["new-comment"].value)
            
        console.log(sandwichId);

        fetch(`http://localhost:3000/sandwiches/${sandwichId}`, {
            method: 'PATCH',
            headers: {
           'Content-Type': 'application/json',
            },
               body: JSON.stringify({
                commentsArr: "commentsArr".push(event.target["new-comment"].value)
            }),
          })
            .catch(error => console.error('Error:', error));
        });




    ingredientsList.innerHTML = ""
    fetch(`http://localhost:3000/sandwiches/${sandwichId}`)
        .then(res => res.json())
        .then(data => {
            focusedSandwich.innerHTML = ""
            console.log(data.url)
            addFocusedSandwich(data)
            let ingredientsIds = data['sandwich-ingredients-ids']
            ingredientsIds.forEach(id => {
                fetch(`http://localhost:3000/ingredients/${id}`)
                    .then(res => res.json())
                    .then(data => {
                        renderSandwichIngredientList(data)
                    })
            })
        })
})











function addFocusedSandwich(sandwich) {
    const img = document.createElement('img')
    img.src = sandwich.url
    img.classList.add('sandwich-clicked') //Add a CSS class to the img element
    focusedSandwich.appendChild(img) //Append the created img element to the sandwichMenu div
}

function renderSandwichIngredientList(ingredients) {

    console.log(ingredients)
    const ul = document.createElement('ul')
    ingredientsList.append(ul)

    const p = document.createElement('p')
    p.innerHTML = ingredients.name

    const img = document.createElement('img')
    img.src = ingredients.url
    img.classList.add('ingredient-image') //Add a CSS class to the img element

    ul.appendChild(img)
    ul.appendChild(p)
}

//1.3 Make an HTTP GET request to fetch the sandwich data from the server
fetch('http://localhost:3000/sandwiches')
    .then((res) => res.json())
    .then(data => {
        //1.4 Iterate through the sandwich objects and create img tags for each
        data.forEach(sandwich => {
            createSandwichImage(sandwich)
        })
    })
    .catch(error => {
        console.error('Error fetching data:', error)
    })

//3. Statz's code: Create randomizer event listener
const randomButtonContainer = document.getElementById('randomButtonContainer')
let randomButton = document.createElement('button')
randomButton.setAttribute('id', 'randomButton')
randomButton.textContent = "Random Sandwich"
randomButtonContainer.appendChild(randomButton)

randomButtonContainer.addEventListener('click', (e) => {
    getrandomSandwich()
        .then(randomSandwichId => {
            console.log(randomSandwichId)
            fetch(`http://localhost:3000/sandwiches/${randomSandwichId}`)
                .then(res => res.json())
                .then(data => {
                    focusedSandwich.innerHTML = ""
                    ingredientsList.innerHTML = ""
                    console.log(data.url)
                    addFocusedSandwich(data)
                    let ingredientsIds = data['sandwich-ingredients-ids']
                    ingredientsIds.forEach(id => {
                        fetch(`http://localhost:3000/ingredients/${id}`)
                            .then(res => res.json())
                            .then(data => {
                                renderSandwichIngredientList(data)
                            })
                    })
                })
        })

})
function getrandomSandwich() {
    return fetch('http://localhost:3000/sandwiches')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error fetching data');
            }
        })
        .then(data => {
            let randomIndex = Math.floor(Math.random() * data.length) + 1;
            return randomIndex;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


   