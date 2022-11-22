# Eheaphones

This project is a fully functioning Ecommerce website.

I took a stylistic design and thought I could take the design and the functionality one step further. I used sanity as a front end data base to store all the information for every product that displayed for sale on the store. Using Next.js and React's dynamic rendering capabilities made implementing this part of the project very simple. As well React's re useable component design sped up development by allowing me to make one product page and then tethering it with Next.js' server side rendering to generate pages for every single product.

Using React Context I was able to apply full cart functionality site wide. This allowed for the easy flow of online shopping that most people are used to today. It also drastically simplified the checkout and purchasing processes.

I custom built a checkout form, using React controlled components. Error handling is done on both the frontend and the backend to ensure proper validation. On the frontend I was able to tap into the application wide state held within context to be able to dynamically render the shopping cart contents into the checkout screen for customers to see what they were purchasing and how much it would cost. When the form is submitted the default behaviour is stopped and a trigger is sent to a custom api route. Next.js was instrumental here as well by coming with api routing of the box that makes making your own api routes a breeze. Using this feature, I hooked up the checkout submission button to an api call to a secondary MongoDB database that stores the customer's purchase along with their shipping address and order number. The final step in the purchase process is the random generation of an order number. Using nanoid, a random order number would be generated for each subsequent call to the checkout api. When successful the customer is routed to a success page where there order number is displayed to them.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
