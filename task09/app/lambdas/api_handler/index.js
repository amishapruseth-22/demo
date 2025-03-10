const weatherSDK = require('/opt/weather_sdk'); // Importing the SDK from the Lambda Layer

exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        const path = event.rawPath;
        const method = event.requestContext.http.method;

        if (path === "/weather" && method === "GET") {
            console.log("Valid request received.");

            const weatherClient = new weatherSDK.WeatherClient();
            const weatherData = await weatherClient.getForecast(50.4375, 30.5);

            console.log("Weather data:", JSON.stringify(weatherData, null, 2));

            return {
                statusCode: 200,
                body: JSON.stringify(weatherData),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        } else {
            console.error(`Invalid request: path=${path}, method=${method}`);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    statusCode: 400,
                    message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
                }),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message
            }),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    }
};
