# Ojec
Project of a web application for UNICAM-PW.

### Essentials: 

The project is a simple website, an e-commerce made with AngularJS, NodeJS, Express and MongoDB.

[Application deployed on Heroku](http://ojec.herokuapp.com)
[Presentation on Youtube](https://www.google.it)

### Implemented user stories:
1. Come admin voglio poter accedere ad un’area privata tramite username e password;
2. Come admin voglio gestire le rimanenze e i re-ordini dei prodotti;
3. Il server deve inviare una email all’admin quando sta per terminare un prodotto;
4. Come admin voglio poter creare e inserire un nuovo prodotto (con proprietà come nome, descrizione, peso, ecc.);
5. Come user voglio essere avvertito quando un prodotto terminato, risulta nuovamente disponibile;
6. Come admin voglio poter modificare un prodotto inserito precedentemente;
7. Come user voglio poter ricercare un prodotto all'interno dell'eccomerce;
8. Come user voglio aver una nuova password se mi dimentico la precedente;  
9. Come user voglio poter modificare il mio ordine, in ordine di quantità o rimuovere un prodotto, nella mia sezione "Cart";
10. Come user voglio poter visualizzare la cronologia dei miei ordini passati;
11. Come user voglio poter visualizzare i prodotti presenti nell'eccomerce secondo quattro criteri, in ordine alfabetico crescente o decrescente, o in ordine dall'ultimo inserito o dal primo inserito;
12. Come user voglio aver la possibilità di vendere i miei prodotti nell'ecommerce diventando admin, se la mia richiesta viene accettata;

### Folder Structure:

    Ojec
    |               
    +---client  /* Client side files */
    |   |   bower.json
    |   |   d.jpg
    |   |   favicon.ico
    |   |   index.html
    |   |   
    |   +---css
    |   |       about.css
    |   |       cart.css
    |   |       contacts.css
    |   |       forgot.css
    |   |       form-Style.css
    |   |       frontpage.css
    |   |       itemCS.css
    |   |       past.css
    |   |       productPage.css
    |   |       sell.css
    |   |       sellItem.css
    |   |       style.css
    |   |       user.css
    |   |       watchList.css
    |   |       
    |   +---javascript
    |   |       about.controller.js
    |   |       cart.controller.js
    |   |       frontpage.controller.js
    |   |       mainApp.configuration.js
    |   |       mainApp.controller.js
    |   |       mainApp.factory.js
    |   |       mainApp.module.js
    |   |       mainApp.services.js
    |   |       notused.js
    |   |       past.controller.js
    |   |       productPage.controller.js
    |   |       sellItem.controller.js
    |   |       sellList.controller.js
    |   |       user.controller.js
    |   |       watchList.controller.js
    |   |       
    |   +---partials
    |   |       about.html
    |   |       cart.html
    |   |       contact.html
    |   |       dropdown.html
    |   |       forgot.html
    |   |       frontpage.html
    |   |       itemsCurrentlySelling.html
    |   |       past.html
    |   |       productPage.html
    |   |       sell.html
    |   |       sellItem.html
    |   |       signup.html
    |   |       user.html
    |   |       watchList.html
    |   |       
    |   \---uploads
    |       |   Sample images.
    |       |   
    |       \---sulimovskyy.vladyslav /* One folder for each uploader */
    |               Sample images.
    |               
    \---server /* Server side files */
        |   fill_with_random_junk.js
        |   package-lock.json
        |   package.json
        |   server.js
        |   
        +---middlewares
        |       authenticated-admin.middleware.js
        |       authenticated-user.middleware.js
        |       
        +---modules
        |       config.js
        |       product.js
        |       transaction.js
        |       user.js
        |           
        \---routes
                authenticated-admin.routes.js
                authenticated-user.routes.js
                public.routes.js
            
### How-to:
Requirements:
* NodeJS 
* NPM 
* MongoDB daemon running or a mlab remote

Setting-up:

    git clone https://github.com/bibaroc/Ojec.git
    cd ./Ojec/server
    npm install 
    node ./fill_with_random_junk.js
    node server.js

Navigate to localhost:8080

### Final notes:

Proundly brought to you by:
* Benigni Lucia, lucia.benigni@studenti.unicam.it
* Dervisi Betim, betim.dervisi@studenti.unicam.it
* Sulimovskyy Vladyslav, vladysla.sulimovskyy@studenti.unicam.it
