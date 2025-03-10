class WeatherClient {
    async getForecast(latitude, longitude) {
        return {
            latitude,
            longitude,
            generationtime_ms: 0.025,
            utc_offset_seconds: 7200,
            timezone: "Europe/Kiev",
            timezone_abbreviation: "EET",
            elevation: 188.0,
            hourly_units: {
                time: "iso8601",
                temperature_2m: "°C",
                relative_humidity_2m: "%",
                wind_speed_10m: "km/h"
            },
            hourly: {
                time: ["2023-12-04T00:00", "2023-12-04T01:00", "2023-12-04T02:00", "..."],
                temperature_2m: [-2.4, -2.8, -3.2, "..."],
                relative_humidity_2m: [84, 85, 87, "..."],
                wind_speed_10m: [7.6, 6.8, 5.6, "..."]
            }
        };
    }
}

module.exports = { WeatherClient };
