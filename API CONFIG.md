# API Configuration Guide

## Flight API Integration

The Dynamic Flight booking system now supports integration with real flight APIs. Here's how to configure it:

### Current API Setup

The system is configured to use **AviationStack API** by default, but can be easily modified to work with other flight APIs.

### Configuration Options

In `script.js`, you'll find the `API_CONFIG` object:

```javascript
const API_CONFIG = {
    baseURL: 'https://api.aviationstack.com/v1',
    apiKey: 'your_api_key_here', // Replace with actual API key
    useMockData: true // Set to false when you have a real API key
};
```

### Getting an API Key

#### Option 1: AviationStack (Recommended for testing)
1. Visit [AviationStack](https://aviationstack.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace `'your_api_key_here'` with your actual key
5. Set `useMockData: false`

#### Option 2: Other Flight APIs
You can modify the code to work with other APIs like:
- **Amadeus API** - Professional flight search
- **Skyscanner API** - Comprehensive flight data
- **Google Flights API** - Real-time pricing

### API Response Format

The system expects API responses in this format:

```json
{
  "data": [
    {
      "airline": {
        "name": "American Airlines"
      },
      "flight": {
        "iata": "AA123"
      },
      "departure": {
        "iata": "JFK",
        "scheduled": "2024-02-15T08:30:00Z"
      },
      "arrival": {
        "iata": "LAX", 
        "scheduled": "2024-02-15T11:45:00Z"
      }
    }
  ]
}
```

### Fallback System

The system includes a robust fallback mechanism:

1. **Primary**: Real API data (when configured)
2. **Fallback**: Enhanced mock data with realistic flight generation
3. **Error Handling**: Graceful degradation if API fails

### Mock Data Features

When using mock data (`useMockData: true`), the system:

- Generates 3-5 additional flights per search
- Uses realistic airline names and flight numbers
- Provides varied pricing ($200-$950)
- Includes different departure times and durations
- Simulates API response delays for realistic UX

### Customization

#### Adding New Airlines
Edit the `airlines` array in `generateAdditionalFlights()`:

```javascript
const airlines = ['SkyWings', 'Global Air', 'Premium Airways', 'Oceanic Airlines', 'Continental Express', 'Pacific Wings'];
```

#### Modifying Price Ranges
Update the price generation in `generatePrice()`:

```javascript
function generatePrice() {
    return Math.floor(Math.random() * 800) + 150; // $150-$950
}
```

#### Adding More Airports
Extend the `airports` array in `script.js`:

```javascript
const airports = [
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
    // Add more airports here...
];
```

### Production Deployment

For production use:

1. **Environment Variables**: Store API keys securely
2. **Rate Limiting**: Implement proper API rate limiting
3. **Caching**: Add response caching for better performance
4. **Error Monitoring**: Set up proper error tracking
5. **Backup APIs**: Configure multiple API providers

### Testing

The system works perfectly with mock data for development and testing. You can:

1. Test all functionality without an API key
2. Develop and customize the UI/UX
3. Add new features
4. Switch to real API when ready

### Support

If you need help integrating with a specific API or have questions about the configuration, the system is designed to be easily extensible and well-documented.
