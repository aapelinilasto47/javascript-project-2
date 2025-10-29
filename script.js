// haetaan pari muuttujaa
const resultDiv = document.getElementById("result");
const searchContainer = document.getElementById("search-container");
const openWishlistButton = document.getElementById("open-wishlist-button");
// luodaan wishlist taulukko
let wishlist = [];

// kun sivu on ladattu, näytetään tuotteet ja tyhjennetään wishlist
document.addEventListener("DOMContentLoaded", function() {
    showData();
    wishlist = [];
});

// funktio tuotteiden näyttämiseen, joka tuotteen kohdalla kutsutaan presentProducts funktiota, tuotteita on yhteensä 20kpl
function showData() {
    fetchProduct().then(allProducts => {
        resultDiv.innerHTML = "";
        for (let i = 0; i < allProducts.length && i < 20; i++) {

            presentProducts(allProducts[i]);

        }     
    });
}

// funktio tuotteiden hakemiseen API:sta
function fetchProduct() {
    return fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(data => {
            let allProducts = data;
            return allProducts;
            // palautetaan kaikki tuotteet
    
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            // jos virhe, palautetaan tyhjä taulukko
            return [];
        });
        
}

// funktio tuotteiden hakemiseen hakusanan perusteella
function searchProducts(query) {
    return fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(data => {
            let allProducts = data;
            return allProducts.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
            // suodatetaan tuotteet hakusanan perusteella ja palautetaan ne
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            // jos virhe, palautetaan tyhjä taulukko
            return [];
        });
}

// funktiot hakukentän kuunteluun, joka kutsuu searchProducts funktiota ja näyttää hakutulokset
document.getElementById("search-input").addEventListener("keypress", function() {
    const query = document.getElementById("search-input").value;
    searchProducts(query).then(filteredProducts => {
        resultDiv.innerHTML = "";
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                presentProducts(product);
                // kutsutaan presentProducts funktiota jokaiselle tuotteelle
            });
        } else {
            resultDiv.innerHTML = "<p>No products found.</p>";
            // jos ei löydy tuotteita, näytetään viesti
        }
    });
});

// luodaan myös search buttonille kuuntelija
document.getElementById("search-button").addEventListener("click", function() {
    const query = document.getElementById("search-input").value;
    searchProducts(query).then(filteredProducts => {
        resultDiv.innerHTML = "";
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                presentProducts(product);
            });
        } else {
            resultDiv.innerHTML = "<p>No products found.</p>";
        }
    });
});


// funktio tuotteiden esittämiseen, tämä funktio tehdään jokaiselle tuotteelle erikseen
function presentProducts(product) {

    wishlistLength = wishlist.length;
    openWishlistButton.textContent = `Open Wishlist (${wishlistLength})`;
    // luodaan tuotteen kontaineri
    const productContainer = document.createElement("div");
    productContainer.className = "product-container";
    productContainer.id = "product-" + product.id;
    resultDiv.appendChild(productContainer);
    // lisätään kuvakontaineri
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    productContainer.appendChild(imgContainer);

    // lisätään kuva
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.width = 100;
    imgContainer.appendChild(img);

    // lisätään nimikontaineri ja nimi
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    productContainer.appendChild(titleContainer);
    const p = document.createElement("p");
    p.className = "product-info";
    // jos nimi on yli 50 merkkiä, lyhennetään se ja lisätään ...
    if (product.title.length >= 50) {
        p.textContent = `${product.title.slice(0, 50)}...`;
    }
    else {
        p.textContent = product.title;
    }
    titleContainer.appendChild(p);

    // lisätään hintakontaineri ja hinta

    const priceContainer = document.createElement("div");
    priceContainer.className = "price-container";
    productContainer.appendChild(priceContainer);
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = `$${product.price}`;
    priceContainer.appendChild(price);

    // lisätään nappulat kontaineri ja wishlist nappula

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    productContainer.appendChild(buttonContainer);

    const button = document.createElement("button");
    button.className = "add-to-wishlist";
    button.id = "add-to-wishlist-" + product.id;
    button.textContent = "Add to Wishlist";
    // nappulan klikkaus lisää tuotteen wishlistiin
    button.addEventListener("click", function() {
        wishlist.push(product);
        
        wishlistLength = wishlist.length;
        openWishlistButton.textContent = `Open Wishlist (${wishlistLength})`;

    });
    buttonContainer.appendChild(button);

    // nappula tuotteen yksityiskohtiin
    const button2 = document.createElement("button");
    button2.className = "view-details";
    button2.id = "view-details-" + product.id;
    button2.textContent = "View Details";
    // nappulan klikkaus näyttää tuotteen yksityiskohdat
    button2.addEventListener("click", function() {
        resultDiv.innerHTML = "";
        presentProductDetails(product);
    });
    buttonContainer.appendChild(button2);

    // wishlistin avaus nappulan kuuntelija
    openWishlistButton.addEventListener("click", function() {
        resultDiv.innerHTML = "";
        showWishlist();
    });
}

// funktio tuotteen yksityiskohtaiseen esittämiseen
function presentProductDetails(product) {
    wishlistLength = wishlist.length;
    openWishlistButton.textContent = `Open Wishlist <b>(${wishlistLength})</b>`;
    // luodaan tuotteen yksityiskohtien kontaineri
    const detailContainer = document.createElement("div");
    detailContainer.className = "detail-container";
    detailContainer.id = "detail-" + product.id;
    resultDiv.appendChild(detailContainer);

    // lisätään kuvakontaineri ja kuva
    const imgContainer = document.createElement("div");
    imgContainer.className = "detail-img-container";
    detailContainer.appendChild(imgContainer);
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.width = 200;
    imgContainer.appendChild(img);

    // lisätään tekstikontaineri, tuotenimi ja kuvaus
    const textContainer = document.createElement("div");
    textContainer.className = "detail-text-container";
    detailContainer.appendChild(textContainer);
    const title = document.createElement("h2");
    title.textContent = product.title;
    title.className = "product-title";
    textContainer.appendChild(title);

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    textContainer.appendChild(description);

    // lisätään hintakontaineri ja hinta
    const priceContainer = document.createElement("div");
    priceContainer.className = "detail-price-container";
    textContainer.appendChild(priceContainer);
    const price = document.createElement("p");
    price.className = "detail-product-price";
    price.textContent = `$${product.price}`;
    priceContainer.appendChild(price);

    // lisätään nappula kontaineri
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "detail-button-container";
    textContainer.appendChild(buttonContainer);

    // lisätään takaisin nappula ja tehdään sille tapahtumankuuntelija
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Products";
    backButton.className = "back-button";
   backButton.addEventListener("click", function() {
       resultDiv.innerHTML = "";
       
       showData();
       // kutsutaan showData funktiota takaisin painalluksella
       
   });
   buttonContainer.appendChild(backButton);

    // lisätään wishlist nappula ja tehdään sille tapahtumankuuntelija
   const wishlistButton = document.createElement("button");
    wishlistButton.className = "detail-add-to-wishlist";
    wishlistButton.id = "add-to-wishlist-" + product.id;
    wishlistButton.textContent = "Add to Wishlist";

    wishlistButton.addEventListener("click", function() {
        // nappulan klikkaus lisää tuotteen wishlistiin
        
        wishlist.push(product);
        wishlistLength = wishlist.length;
        openWishlistButton.textContent = `Open Wishlist (${wishlistLength})`;

    });
    buttonContainer.appendChild(wishlistButton);
}

// funktio wishlistin näyttämiseen
function showWishlist() {
    wishlistLength = wishlist.length;
    openWishlistButton.textContent = `Open Wishlist (${wishlistLength})`;
    // tarkistetaan onko wishlist tyhjä
    if (wishlist.length === 0) {
        resultDiv.innerHTML = "";
        // luodaan tyhjälle wishlistille viesti
        const emptyContainer = document.createElement("div");
        emptyContainer.className = "empty-wishlist-container";
        resultDiv.appendChild(emptyContainer);
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your wishlist is empty.";
        emptyMessage.className = "empty-wishlist-message";
        emptyContainer.appendChild(emptyMessage);
        // lisätään takaisin tuotteisiin nappula
        const backButton = document.createElement("button");
        backButton.textContent = "Back to Products";
        backButton.className = "back-button-empty";
        // takaisin nappulan kuuntelija
        backButton.addEventListener("click", function() {
            resultDiv.innerHTML = "";
            showData();
        });
        emptyContainer.appendChild(backButton);
    } else {
        // jos wishlist ei ole tyhjä, näytetään tuotteet wishlististä yksitellen
        wishlist.forEach(product => {
            // luodaan tuotteen wishlist-kontaineri
            const productDiv = document.createElement("div");
            productDiv.className = "wishlist-product-container";
            resultDiv.appendChild(productDiv);
            // lisätään kuvakontaineri ja kuva
            const imgContainer = document.createElement("div");
            imgContainer.className = "wishlist-img-container";
            productDiv.appendChild(imgContainer);

            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.title;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            imgContainer.appendChild(img);
            // lisätään tekstikontaineri, tuotenimi ja kuvaus
            const textContainer = document.createElement("div");
            textContainer.className = "wishlist-text-container";
            
            productDiv.appendChild(textContainer);
            const title = document.createElement("h3");
            title.className = "wishlist-product-title";
            title.textContent = product.title;
            textContainer.appendChild(title);

            const description = document.createElement("p");
            description.className = "wishlist-product-description";
            description.textContent = product.description;
            textContainer.appendChild(description);

            // lisätään hintakontaineri ja hinta
            const priceContainer = document.createElement("div");
            priceContainer.className = "wishlist-price-container";
            productDiv.appendChild(priceContainer);

            const price = document.createElement("p");
            price.className = "wishlist-product-price";
            price.textContent = `$${product.price}`;
            priceContainer.appendChild(price);

            // lisätään nappulat kontaineri
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "wishlist-button-container";
            productDiv.appendChild(buttonContainer);

            // lisätään view details nappula ja tehdään sille tapahtumankuuntelija
            const detailsButton = document.createElement("button");
            detailsButton.textContent = "View Details";
            detailsButton.className = "view-wishlist-details";
            detailsButton.addEventListener("click", function() {
                resultDiv.innerHTML = "";
                presentProductDetails(product);
                // kutsutaan presentProductDetails funktiota
            });
            buttonContainer.appendChild(detailsButton);

            // lisätään remove from wishlist nappula ja tehdään sille tapahtumankuuntelija
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove-from-wishlist";

            removeButton.addEventListener("click", function() { 
                const index = wishlist.indexOf(product);
                // poistetaan tuote wishlististä
                if (index > -1) {
                    wishlist.splice(index, 1);
                }
                resultDiv.innerHTML = "";
                // kutsutaan showWishlist funktiota uudestaan
                showWishlist();
            });
            buttonContainer.appendChild(removeButton);


        });
    }}