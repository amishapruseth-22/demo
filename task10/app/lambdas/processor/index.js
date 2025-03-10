const AWS = require("aws-sdk");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const AWSXRay = require("aws-xray-sdk");

// Enable X-Ray tracing for AWS SDK
const dynamoDB = AWSXRay.captureAWSClient(new AWS.DynamoDB.DocumentClient());
const tableName = process.env.TABLE_NAME;

// Open-Meteo API URL
const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

exports.handler = async (event) => {
  const segment = AWSXRay.getSegment().addNewSubsegment("WeatherDataProcessing");

  try {
    // Fetch weather data from Open-Meteo API
    const weatherResponse = await axios.get(API_URL);
    const weatherData = weatherResponse.data;

    // Prepare data for DynamoDB
    const item = {
      id: uuidv4(),
      forecast: weatherData,
    };

    // Store data in DynamoDB
    await dynamoDB.put({ TableName: tableName, Item: item }).promise();

    segment.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Weather data stored successfully!", data: item }),
    };
  } catch (error) {
    segment.addError(error);
    segment.close();
    return { statusCode: 500, body: JSON.stringify({ message: "Error fetching or storing data", error }) };
  }
};
