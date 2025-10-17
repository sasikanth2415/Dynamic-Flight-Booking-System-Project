# Dynamic-Flight-Booking-System-Project
# Dynamic Flight Booking System

A modern, responsive flight booking system built with HTML, CSS, and JavaScript.

## Features

### ✈️ Flight Search
- **Smart Search Form**: Search flights by departure/destination cities, dates, passengers, and class
- **City Dropdown Lists**: Easy selection from comprehensive list of airports worldwide
- **API Integration**: Real-time flight data from AviationStack API with fallback to enhanced mock data
- **Dynamic Flight Generation**: Creates realistic additional flights for any route
- **Trip Types**: Support for both round-trip and one-way flights
- **Date Validation**: Prevents booking past dates and ensures return date is after departure

### 🎯 Flight Results
- **Comprehensive Display**: Shows airline, flight number, times, duration, stops, and pricing
- **Sorting Options**: Sort flights by price, duration, or departure time
- **Visual Design**: Clean, modern card-based layout with airline logos
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices

### 📋 Booking System
- **Passenger Information**: Collect passenger details (name, email, phone)
- **Payment Processing**: Secure payment form with validation
- **Booking Confirmation**: Generate unique booking IDs and confirmations
- **Local Storage**: Bookings are saved locally and persist between sessions

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Modern UI**: Gradient backgrounds, shadows, and clean typography
- **Accessibility**: Proper form labels, keyboard navigation, and screen reader support

## File Structure

```
Dynamic Flight/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality with API integration
├── README.md           # This file
└── API_CONFIG.md       # API configuration guide
```

## How to Use

### 1. Open the Application
Simply open `index.html` in your web browser. No server setup required!

### 2. Search for Flights
1. Select your trip type (Round Trip or One Way)
2. Choose number of passengers
3. Select departure and destination cities from dropdown lists
4. Select departure and return dates
5. Choose your preferred class
6. Click "Search Flights"

### 3. Book a Flight
1. Review available flights in the results section
2. Use sorting options to find the best option
3. Click "Book This Flight" on your preferred flight
4. Fill in passenger information
5. Enter payment details
6. Confirm your booking

### 4. Manage Bookings
- View all your bookings in the "My Bookings" section
- Each booking shows complete details and status
- Bookings are automatically saved and persist between sessions

## Flight Data Sources

### API Integration
- **AviationStack API**: Real-time flight data (requires API key)
- **Fallback System**: Enhanced mock data when API is unavailable
- **Dynamic Generation**: Creates realistic flights for any route combination

### Sample Routes
The system includes flights for popular routes:
- New York (JFK) ↔ Los Angeles (LAX)
- San Francisco (SFO) ↔ London (LHR)
- Chicago (ORD) ↔ Paris (CDG)
- Los Angeles (LAX) ↔ Tokyo (NRT)
- And many more international destinations

## Technical Features

### JavaScript Functionality
- **Event Handling**: Comprehensive event listeners for all interactions
- **API Integration**: Async/await pattern for flight data fetching
- **Data Management**: Local storage for booking persistence
- **Form Validation**: Client-side validation for all inputs
- **Dynamic Content**: Real-time updates and DOM manipulation
- **Search Logic**: Intelligent flight filtering and sorting
- **Error Handling**: Graceful fallback when API fails

### CSS Features
- **Responsive Grid**: CSS Grid and Flexbox for layouts
- **Modern Styling**: Gradients, shadows, and smooth transitions
- **Mobile Optimization**: Hamburger menu and mobile-first design
- **Custom Components**: Modal dialogs, loading states, and animations

### HTML Structure
- **Semantic HTML**: Proper use of semantic elements
- **Accessibility**: ARIA labels and keyboard navigation
- **Form Elements**: Comprehensive form structure with validation
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Future Enhancements

Potential improvements for a production system:
- Backend API integration
- Real-time flight data
- User authentication
- Email confirmations
- Payment gateway integration
- Advanced filtering options
- Seat selection
- Check-in functionality

## Getting Started

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start searching and booking flights!

The system is ready to use immediately with sample data and full functionality.
