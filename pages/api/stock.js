import { client } from "../../lib/client"

async function handler(req, res) {
    if (req.method === "POST") {
        // Save the body of the request to go through each item that needs stock updates
        const itemsToUpdate = { ...req.body }

        // Error handling

        // Use the client to patch each item in the database

        // Loop through each item so we can update each item
        for (let i = 0; i < itemsToUpdate.cartItems.length; i++) {
            const item = itemsToUpdate.cartItems[i]

            const optionIndex = item.options.findIndex(
                (option) => option._key === item.chosenOption._key
            )

            console.log(optionIndex)

            const path = `options[${optionIndex}].stock`

            await client
                .patch(item._id)
                .dec({ [path]: item.quantity })
                .commit()
        }
        res.status(201).json({
            message: "Successfully Updated!",
            itemsToUpdate,
        })
    }
}

export default handler
