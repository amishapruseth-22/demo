const weatherSDK = require('/opt/weather_sdk'); // Importing the SDK from the Lambda Layer

exports.handler = async (event) => {
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    if (path === "/weather" && method === "GET") {
        const weatherClient = new weatherSDK.WeatherClient(); // Ensure this class exists in weather_sdk.js
        const weatherData = await weatherClient.getForecast(50.4375, 30.5);

        return {
            statusCode: 200,
            body: JSON.stringify(weatherData),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    } else {
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
};
