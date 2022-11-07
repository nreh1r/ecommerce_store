import { MongoClient } from "mongodb"

async function handler(req, res) {
    if (req.method === "POST") {
        // Save the body of the request in a variable for error handling
        const newOrder = { ...req.body }

        // Error handling

        if (
            !newOrder.email ||
            !newOrder.email.includes("@") ||
            !newOrder.firstName ||
            !newOrder.lastName ||
            !newOrder.firstName.trim() === "" ||
            !newOrder.lastName.trim() === ""
        ) {
            res.status(422).json({ message: "Invalid input." })
        }

        // Store order info in database
        let client
        const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clusterName}.5hmp6vn.mongodb.net/${process.env.mongodb_database2}?retryWrites=true&w=majority`

        try {
            client = await MongoClient.connect(connectionString)
        } catch (error) {
            res.status(500).json({ message: "Could not connect to database" })
            console.log("connection failed")
            return
        }

        const db = client.db()
        try {
            const result = await db.collection("new-orders").insertOne(newOrder)
        } catch (error) {
            res.status(500).json({ message: "Storing order failed" })
            return
        }

        client.close()
        res.status(201).json({
            message: "Successfully stored order!",
            newOrder,
        })
    }
}

export default handler
