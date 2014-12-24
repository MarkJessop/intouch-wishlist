# Wishlist

Wishlist allows users to add an Amazon product to their wishlist and include a price where they're willing to purchase the item.  The application keeps a look out for sales and when it finds a price below an item's price point, it prompts the user to purchase the item.  Items can be purchased directly from the application by a storing a credit card and address.

## Installing Wishlist
-  Start by cloning the vagrant server and starting it up
```
git clone https://github.com/MarkJessop/intouch-wishlist.git
vagrant up
```
-SSH into the vagrant server and change the directory to intouch-wishlist
```
vagrant ssh
cd intouch-wishlist
```
- Start the node server
```
npm start
```

## Using Wishlist


- Add items by searching on Amazon and by copying and pasting their ASIN number (usually found near the bottom of the page).  Include a price you'd be willing to purchase.  If it's below Amazon's price a purchase button will appear

- Example data

Item | ASIN | Price
--- | --- | ---
Disney Frozen Sparkle Elsa Dol | B00C6Q1Z6E | 30
XMark Fitness Adjustable Dumbbell (50-Pound) | B003JVGEZM | 200
Bowflex SelectTech 552 Adjustable Dumbbells (Pair) | B001ARYU58 | 400

- Credit card info from Stripe can also be used.  Here are some numbers that can be added to the User's information panel

Number |	Card type
--- | ---
4242424242424242|	Visa
4012888888881881|	Visa
4000056655665556|	Visa (debit)
5555555555554444|	MasterCard
5200828282828210|	MasterCard (debit)
5105105105105100|	MasterCard (prepaid)
378282246310005|	American Express
371449635398431|	American Express
6011111111111117|	Discover
6011000990139424|	Discover
30569309025904|	Diners Club
38520000023237|	Diners Club
3530111333300000|	JCB
3566002020360505|	JCB

## How it Works

Wishlist works by connecting to Amazon's public facing Product Advertising API.  When a user adds a product to their wishlist, the API is accessed and item details from Amazon are added to the item's entry in the database.  These details include, price, the item's name, and the Amazon store listing URL.

Every 30 minutes the application updates the pricing information from Amazon.  The Amazon price is compared to the user's desired price and if it is lower, a purchase button will appear.  Clicking this button sends a charge to the credit card by connection to the Stripe API.  Using the user's credit card and address details, Stripe is able to charge the user's credit card.  An order can then placed with Amazon by using Zinc.io's API (not implemented).

### What Works and What Doesn't

Due to time constrainsts, the application is not fully complete.  The following is a list of what works and doesn't work in the application

#### Works

- Charging a user's credit card using Stripe
- Adding products to the wishlist
- Automatic updating of product prices
- Updating user information including the credit card

#### Doesn't Work

- There's currently no user authentication.  All data resides on one user.
- Zinc.io integration isn't in place, so items will not be shipped after purchase
- Editing item price points
- Deleting an item from the wishlist (these can both be done by extending the items route)
- Adding items that don't have an ASIN number (books with only ISBN numbers won't work)

## Testing

This application has a series of unit tests that can be run.  To begin SSH back into the vagrant server and return to the intouch-wishlist directory

```
vagrant ssh
cd intouch-wishlist
```

Shutdown the currently running node server (Ctrl-C) and start up the server with the test environment variable
```
npm run-script test
```

In another command window, run the tests
```
npm test
```

## Roadmap

- User authentication to allow multiple users to login and add products.  Can be done through passport
- Searching Amazon products on the site.  Using their API this wouldn't be hard to implament and would make for a better user experience then manually typing in an ASIN
- Integrating application with Zinc.io to fully automate the purchasing process
- Allows users the ability to manage their Wishlist better by updating price points and deleting items
- Creating an order history so that User's can view what they have ordered in the past
- Allowing more types of items to be added to the Wishlist (more then just items with ASIN)
- Historic price tracking and visualization. Graphs and tables to show how a products price fluctuates over time