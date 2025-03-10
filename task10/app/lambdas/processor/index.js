const AWS = require("aws-sdk");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const AWSXRay = require("aws-xray-sdk");

// Enable X-Ray tracing for AWS SDK
const dynamoDB = AWSXRay.captureAWSClient(new AWS.DynamoDB.DocumentClient());
const tableName = process.env.TABLE_NAME;

// Open-Meteo API URL
const weatherApiUrl = process.env.WEATHER_API_URL;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

      try {
          // Fetch data from Open-Meteo API
          const response = await axios.get(weatherApiUrl);
          const weatherData = response.data;

          // Prepare data for DynamoDB
          const item = {
              id: uuidv4(),
              forecast: weatherData,
          };

          // Insert the data into DynamoDB
          await dynamoDB.put({
              TableName: tableName,
              Item: item,
          }).promise();

          console.log("Successfully stored weather data:", item);

          // Return success response
          return {
              statusCode: 200,
              body: JSON.stringify({
                  message: "Weather data stored successfully",
                  data: item,
              }),
          };
      } catch (error) {
          console.error("Error:", error);

          // Return error response
          return {
              statusCode: 500,
              body: JSON.stringify({
                  message: "Failed to store weather data",
                  error: error.message,
              }),
          };
      }
  };