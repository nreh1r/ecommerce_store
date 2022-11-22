export default {
    name: "discount",
    title: "Discount Codes",
    type: "document",
    fields: [
        {
            name: "codes",
            title: "Codes",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "code", type: "string", title: "Code" },
                        { name: "percent", type: "number", title: "Percent" },
                        {
                            name: "times_used",
                            type: "number",
                            title: "TimesUsed",
                        },
                    ],
                },
            ],
        },
    ],
}
