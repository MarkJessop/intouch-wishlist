# Wishlist

Wishlist allows users to add an Amazon product to their wishlist and include a price where they're willing to purchase the item.  The application keeps a look out for sales and when it finds a price below an item's price point, it prompts the user to purchase the item.  Items can be purchased directly from the application by a storing a credit card and address.

## Using Wishlist

## How it Works

Wishlist works by connecting to Amazon's public facing Product Advertising API.  When a user adds a product to their wishlist, the API is accessed and item details from Amazon are added to the item's entry in the database.  These details include, price, the item's name, and the Amazon store listing URL.

Every 30 minutes the application updates the pricing information from Amazon.  The Amazon price is compared to the user's desired price and if it is lower, a purchase button will appear.  Clicking this button sends a charge to the credit card by connection to the Stripe API.  Using the user's credit card and address details, Stripe is able to charge the user's credit card.  An order can then placed with Amazon by using Zinc.io's API (not implamented).

### What Works and What Doesn't

Due to time constrainsts, the application is not fully complete.  The following is a list of what works and doesn't work in the application

#### Works

. Charging a user's credit card using Stripe
. Adding products to the wishlist
. Automatic updating of product prices
. Updating user information including the credit card

#### Doesn't Work

. Zinc.io integration isn't in place, so items will not be shipped after purchase
. Editing item price points
. Deleting an item from the wishlist (these can both be done by extending the items route)
. Adding items that don't have an ASIN number 

## Roadmap

.