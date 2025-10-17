// Flight Booking System JavaScript

// Global variables
let flights = [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let selectedFlight = null;
let bookingStepIndex = 0;
let extrasSelection = { baggage: 0, meal: 'none', seatPref: 'auto' };

// API Configuration
const API_CONFIG = {
    // Using a free flight API - you can replace with your preferred API
    baseURL: 'https://api.aviationstack.com/v1',
    // Note: In production, you should use environment variables for API keys
    apiKey: 'your_api_key_here', // Replace with actual API key
    // Fallback to mock data if API fails
    useMockData: true
};

// Airport data with focus on Indian airports
const airports = [
    // Indian Airports
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
    { code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi' },
    { code: 'GOI', name: 'Dabolim Airport', city: 'Goa' },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur' },
    { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow' },
    { code: 'IXB', name: 'Bagdogra Airport', city: 'Bagdogra' },
    { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati' },
    { code: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram' },
    
    // International Airports
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
    { code: 'LHR', name: 'London Heathrow Airport', city: 'London' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt' },
    { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam' },
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo' },
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore' },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok' },
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur' }
];

// Sample flight data with Indian routes and INR pricing
const sampleFlights = [
    {
        id: 1,
        airline: 'Air India',
        flightNumber: 'AI101',
        from: 'DEL',
        to: 'BOM',
        departureTime: '08:30',
        arrivalTime: '10:45',
        departureDate: '2024-02-15',
        arrivalDate: '2024-02-15',
        duration: '2h 15m',
        stops: 0,
        price: 8500,
        class: 'economy'
    },
    {
        id: 2,
        airline: 'IndiGo',
        flightNumber: '6E205',
        from: 'DEL',
        to: 'BOM',
        departureTime: '14:20',
        arrivalTime: '16:35',
        departureDate: '2024-02-15',
        arrivalDate: '2024-02-15',
        duration: '2h 15m',
        stops: 0,
        price: 9200,
        class: 'economy'
    },
    {
        id: 3,
        airline: 'SpiceJet',
        flightNumber: 'SG301',
        from: 'DEL',
        to: 'BOM',
        departureTime: '19:45',
        arrivalTime: '22:00',
        departureDate: '2024-02-15',
        arrivalDate: '2024-02-15',
        duration: '2h 15m',
        stops: 0,
        price: 7800,
        class: 'economy'
    },
    {
        id: 4,
        airline: 'Vistara',
        flightNumber: 'UK102',
        from: 'BOM',
        to: 'DEL',
        departureTime: '09:15',
        arrivalTime: '11:30',
        departureDate: '2024-02-20',
        arrivalDate: '2024-02-20',
        duration: '2h 15m',
        stops: 0,
        price: 9500,
        class: 'economy'
    },
    {
        id: 5,
        airline: 'Air India',
        flightNumber: 'AI206',
        from: 'BOM',
        to: 'DEL',
        departureTime: '15:30',
        arrivalTime: '17:45',
        departureDate: '2024-02-20',
        arrivalDate: '2024-02-20',
        duration: '2h 15m',
        stops: 0,
        price: 8200,
        class: 'economy'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupDateInputs();
    populateCityDropdowns();
    loadBookings();
    generateMoreFlights();
}

function setupEventListeners() {
    // Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Trip type change
    const tripType = document.getElementById('tripType');
    const returnDateGroup = document.getElementById('returnDateGroup');
    
    tripType.addEventListener('change', function() {
        if (this.value === 'oneway') {
            returnDateGroup.style.display = 'none';
            document.getElementById('returnDate').required = false;
        } else {
            returnDateGroup.style.display = 'block';
            document.getElementById('returnDate').required = true;
        }
    });

    // City dropdowns are populated in initializeApp()

    // Form submission
    const searchForm = document.getElementById('flightSearchForm');
    searchForm.addEventListener('submit', handleFlightSearch);

    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    sortSelect.addEventListener('change', sortFlights);

    // Modal functionality
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', handleBookingSubmission);

    // Step navigation
    const nextBtn = document.getElementById('nextStepBtn');
    const backBtn = document.getElementById('backStepBtn');
    const confirmBtn = document.getElementById('confirmBookingBtn');

    if (nextBtn && backBtn && confirmBtn) {
        nextBtn.addEventListener('click', () => moveBookingStep(1));
        backBtn.addEventListener('click', () => moveBookingStep(-1));
    }
    // Event delegation: open modal on card or button click
    const resultsContainer = document.getElementById('flightResults');
    resultsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.book-flight-btn');
        const card = e.target.closest('.flight-card');
        if (button || card) {
            const host = button || card;
            const cardEl = host.closest('.flight-card');
            if (cardEl) {
                const id = cardEl.getAttribute('data-flight-id');
                if (id) openBookingModal(parseId(id));
            }
        }
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Initialize from storage
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') document.body.classList.add('dark');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const modalOpen = modal && modal.style.display === 'block';
        if (!modalOpen) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') moveBookingStep(1);
        if (e.key === 'ArrowLeft') moveBookingStep(-1);
    });
}

function setupDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const departureDate = document.getElementById('departureDate');
    const returnDate = document.getElementById('returnDate');
    
    departureDate.min = today.toISOString().split('T')[0];
    departureDate.value = tomorrow.toISOString().split('T')[0];
    
    returnDate.min = tomorrow.toISOString().split('T')[0];
    returnDate.value = new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    departureDate.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        returnDate.min = nextDay.toISOString().split('T')[0];
    });
}

function populateCityDropdowns() {
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    
    // Sort airports by city name
    const sortedAirports = [...airports].sort((a, b) => a.city.localeCompare(b.city));
    
    // Populate both dropdowns
    sortedAirports.forEach(airport => {
        const option1 = new Option(`${airport.city} (${airport.code})`, airport.code);
        const option2 = new Option(`${airport.city} (${airport.code})`, airport.code);
        
        fromSelect.add(option1);
        toSelect.add(option2);
    });
    
    // Add event listener to prevent same city selection
    fromSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const toOptions = toSelect.querySelectorAll('option');
        
        toOptions.forEach(option => {
            if (option.value === selectedValue && selectedValue !== '') {
                option.style.display = 'none';
                option.disabled = true;
            } else {
                option.style.display = 'block';
                option.disabled = false;
            }
        });
        
        // Reset to selection if same city was selected
        if (toSelect.value === selectedValue) {
            toSelect.value = '';
        }
    });
    
    toSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const fromOptions = fromSelect.querySelectorAll('option');
        
        fromOptions.forEach(option => {
            if (option.value === selectedValue && selectedValue !== '') {
                option.style.display = 'none';
                option.disabled = true;
            } else {
                option.style.display = 'block';
                option.disabled = false;
            }
        });
        
        // Reset from selection if same city was selected
        if (fromSelect.value === selectedValue) {
            fromSelect.value = '';
        }
    });
}

// API Functions
async function fetchFlightsFromAPI(searchParams) {
    if (API_CONFIG.useMockData) {
        // Use mock data for demonstration
        return await fetchMockFlights(searchParams);
    }
    
    try {
        const params = new URLSearchParams({
            access_key: API_CONFIG.apiKey,
            dep_iata: searchParams.from,
            arr_iata: searchParams.to,
            flight_date: searchParams.departureDate
        });
        
        const response = await fetch(`${API_CONFIG.baseURL}/flights?${params}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return transformAPIResponse(data, searchParams);
        
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to mock data
        return await fetchMockFlights(searchParams);
    }
}

async function fetchMockFlights(searchParams) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock flights based on search criteria
    const filteredFlights = sampleFlights.filter(flight => {
        const fromMatch = flight.from === searchParams.from;
        const toMatch = flight.to === searchParams.to;
        const dateMatch = flight.departureDate === searchParams.departureDate;
        
        return fromMatch && toMatch && dateMatch;
    });
    
    // Generate additional flights for demonstration
    const additionalFlights = generateAdditionalFlights(searchParams);
    
    return [...filteredFlights, ...additionalFlights];
}

function transformAPIResponse(apiData, searchParams) {
    // Transform API response to our flight format
    if (!apiData.data || !Array.isArray(apiData.data)) {
        return [];
    }
    
    return apiData.data.map((flight, index) => ({
        id: `api_${index}`,
        airline: flight.airline?.name || 'Unknown Airline',
        flightNumber: flight.flight?.iata || 'N/A',
        from: flight.departure?.iata || searchParams.from,
        to: flight.arrival?.iata || searchParams.to,
        departureTime: formatTime(flight.departure?.scheduled),
        arrivalTime: formatTime(flight.arrival?.scheduled),
        departureDate: searchParams.departureDate,
        arrivalDate: searchParams.departureDate, // Assuming same day for simplicity
        duration: calculateDuration(flight.departure?.scheduled, flight.arrival?.scheduled),
        stops: 0, // API doesn't always provide this
        price: generatePrice(),
        class: searchParams.class || 'economy'
    }));
}

function generateAdditionalFlights(searchParams) {
    const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India', 'Alliance Air'];
    const additionalFlights = [];
    
    // Generate 3-5 additional flights
    const numFlights = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureHour = Math.floor(Math.random() * 20) + 6; // 6 AM to 2 AM
        const departureMinute = Math.floor(Math.random() * 60);
        const duration = Math.floor(Math.random() * 8) + 2; // 2-10 hours
        
        const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
        const arrivalHour = (departureHour + duration) % 24;
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
        
        additionalFlights.push({
            id: `additional_${Date.now()}_${i}`,
            airline: airline,
            flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
            from: searchParams.from,
            to: searchParams.to,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departureDate: searchParams.departureDate,
            arrivalDate: searchParams.departureDate,
            duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
            stops: Math.random() > 0.7 ? 1 : 0,
            price: Math.floor(Math.random() * 15000) + 5000, // ₹5,000-₹20,000
            class: searchParams.class || 'economy'
        });
    }
    
    return additionalFlights;
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function calculateDuration(departureTime, arrivalTime) {
    if (!departureTime || !arrivalTime) return 'N/A';
    
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const diffMs = arr - dep;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

function generatePrice() {
    return Math.floor(Math.random() * 15000) + 5000; // ₹5,000-₹20,000
}

async function handleFlightSearch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const searchParams = {
        from: formData.get('from'),
        to: formData.get('to'),
        departureDate: formData.get('departureDate'),
        returnDate: formData.get('returnDate'),
        passengers: formData.get('passengers'),
        tripType: formData.get('tripType'),
        class: formData.get('class')
    };
    
    // Validate search
    if (searchParams.from === searchParams.to) {
        showMessage('Departure and destination cities cannot be the same.', 'error');
        return;
    }
    
    if (!searchParams.from || !searchParams.to) {
        showMessage('Please select both departure and destination cities.', 'error');
        return;
    }
    
    // Show loading
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<div class="loading"></div> Searching...';
    searchBtn.disabled = true;
    
    try {
        // Fetch flights from API
        const apiFlights = await fetchFlightsFromAPI(searchParams);
        flights = apiFlights;
        
        if (flights.length === 0) {
            showMessage('No flights found for your search criteria. Please try different dates or destinations.', 'error');
            return;
        }
        
        displayFlights(flights);
        updateSearchInfo(searchParams);
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Search error:', error);
        showMessage('An error occurred while searching for flights. Please try again.', 'error');
    } finally {
        // Reset button
        searchBtn.innerHTML = originalText;
        searchBtn.disabled = false;
    }
}


function displayFlights(flightsToShow) {
    const resultsSection = document.getElementById('results');
    const resultsContainer = document.getElementById('flightResults');
    
    resultsSection.style.display = 'block';
    
    resultsContainer.innerHTML = flightsToShow.map(flight => {
        const fromAirport = airports.find(a => a.code === flight.from);
        const toAirport = airports.find(a => a.code === flight.to);
        
        return `
            <div class="flight-card" data-flight-id="${flight.id}">
                <div class="flight-header">
                    <div class="airline-info">
                        <div class="airline-logo">${flight.airline.charAt(0)}</div>
                        <div>
                            <div class="airline-name">${flight.airline}</div>
                            <div class="flight-number">${flight.flightNumber}</div>
                        </div>
                    </div>
                    <div class="flight-price">₹${flight.price.toLocaleString('en-IN')}</div>
                </div>
                
                <div class="flight-details">
                    <div class="departure-info">
                        <div class="time">${flight.departureTime}</div>
                        <div class="airport">${fromAirport.code}</div>
                        <div class="date">${formatDate(flight.departureDate)}</div>
                    </div>
                    
                    <div class="flight-path">
                        <div class="duration">${flight.duration}</div>
                        <div class="flight-path-line"></div>
                        <div class="stops">${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</div>
                    </div>
                    
                    <div class="arrival-info">
                        <div class="time">${flight.arrivalTime}</div>
                        <div class="airport">${toAirport.code}</div>
                        <div class="date">${formatDate(flight.arrivalDate)}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <button class="book-flight-btn">
                        Book This Flight
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateSearchInfo(params) {
    const fromAirport = airports.find(a => a.code === params.from);
    const toAirport = airports.find(a => a.code === params.to);
    
    const searchInfo = document.getElementById('searchInfo');
    searchInfo.textContent = `${fromAirport.city} (${fromAirport.code}) to ${toAirport.city} (${toAirport.code}) - ${formatDate(params.departureDate)}`;
}

function sortFlights() {
    const sortBy = document.getElementById('sortBy').value;
    let sortedFlights = [...flights];
    
    switch(sortBy) {
        case 'price':
            sortedFlights.sort((a, b) => a.price - b.price);
            break;
        case 'duration':
            sortedFlights.sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return durationA - durationB;
            });
            break;
        case 'departure':
            sortedFlights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
            break;
    }
    
    displayFlights(sortedFlights);
}

function parseDuration(duration) {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
}

function openBookingModal(flightId) {
    selectedFlight = flights.find(flight => flight.id === flightId);
    if (!selectedFlight) return;
    
    const modal = document.getElementById('bookingModal');
    const flightInfo = document.getElementById('selectedFlightInfo');
    const totalPrice = document.getElementById('totalPrice');
    
    const fromAirport = airports.find(a => a.code === selectedFlight.from);
    const toAirport = airports.find(a => a.code === selectedFlight.to);
    
    flightInfo.innerHTML = `
        <div class="flight-summary-item">
            <span>Airline:</span>
            <span>${selectedFlight.airline} ${selectedFlight.flightNumber}</span>
        </div>
        <div class="flight-summary-item">
            <span>Route:</span>
            <span>${fromAirport.city} (${fromAirport.code}) → ${toAirport.city} (${toAirport.code})</span>
        </div>
        <div class="flight-summary-item">
            <span>Departure:</span>
            <span>${selectedFlight.departureTime} on ${formatDate(selectedFlight.departureDate)}</span>
        </div>
        <div class="flight-summary-item">
            <span>Arrival:</span>
            <span>${selectedFlight.arrivalTime} on ${formatDate(selectedFlight.arrivalDate)}</span>
        </div>
        <div class="flight-summary-item">
            <span>Duration:</span>
            <span>${selectedFlight.duration}</span>
        </div>
        <div class="flight-summary-item">
            <span>Class:</span>
            <span>${selectedFlight.class.charAt(0).toUpperCase() + selectedFlight.class.slice(1)}</span>
        </div>
        <div class="flight-summary-item">
            <span>Price per passenger:</span>
            <span>₹${selectedFlight.price.toLocaleString('en-IN')}</span>
        </div>
        <div class="flight-summary-item">
            <span>Total Price:</span>
            <span>₹${selectedFlight.price.toLocaleString('en-IN')}</span>
        </div>
    `;
    
    totalPrice.textContent = `₹${selectedFlight.price.toLocaleString('en-IN')}`;
    
    // Reset steps
    bookingStepIndex = 0;
    extrasSelection = { baggage: 0, meal: 'none', seatPref: 'auto' };
    updateExtrasFromForm();
    updateStepperUI();
    updateStepVisibility();
    updateTotalPrice();
    buildSeatGrid();

    // Clear inline booking message if any
    const inlineMsg = document.getElementById('bookingInlineMessage');
    if (inlineMsg) inlineMsg.style.display = 'none';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedFlight = null;
}

function parseId(idStr) {
    const n = parseInt(idStr, 10);
    return isNaN(n) ? idStr : n;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Toasts
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Seat selection
let takenSeats = new Set();
let selectedSeats = new Set();

function buildSeatGrid() {
    const grid = document.getElementById('seatGrid');
    if (!grid) return;
    grid.innerHTML = '';
    takenSeats = new Set(generateTakenSeats());
    selectedSeats = new Set();
    const rows = 6, cols = 6;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const seatId = String.fromCharCode(65 + r) + (c + 1);
            const div = document.createElement('div');
            div.className = 'seat available';
            if (takenSeats.has(seatId)) div.className = 'seat taken';
            div.setAttribute('data-seat', seatId);
            div.title = `Seat ${seatId}`;
            div.addEventListener('click', () => toggleSeat(div, seatId));
            grid.appendChild(div);
        }
    }
}

function toggleSeat(el, seatId) {
    if (takenSeats.has(seatId)) return;
    if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        el.classList.remove('selected');
        el.classList.add('available');
    } else {
        // Allow up to number of passengers
        const numPassengers = parseInt(document.getElementById('passengers')?.value || '1', 10);
        if (selectedSeats.size >= numPassengers) {
            showToast(`You can select up to ${numPassengers} seat(s).`);
            return;
        }
        selectedSeats.add(seatId);
        el.classList.remove('available');
        el.classList.add('selected');
    }
}

function generateTakenSeats() {
    // Randomly block a few seats
    const blocked = [];
    const count = Math.floor(Math.random() * 6) + 6; // 6-12 seats taken
    const set = new Set();
    while (set.size < count) {
        const r = Math.floor(Math.random() * 6);
        const c = Math.floor(Math.random() * 6);
        set.add(String.fromCharCode(65 + r) + (c + 1));
    }
    return Array.from(set);
}

function handleBookingSubmission(event) {
    event.preventDefault();

    if (bookingStepIndex < 3) {
        // If not on final step, advance instead of submitting
        moveBookingStep(1);
        return;
    }
    
    if (!selectedFlight) {
        showBookingInline('No flight selected for booking.', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const bookingData = {
        id: generateBookingId(),
        flight: selectedFlight,
        passenger: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        payment: {
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            cardName: formData.get('cardName')
        },
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        totalPrice: calculateGrandTotal()
    };
    
    // Validate payment (basic validation)
    // Payment validation skipped on request – allow confirming without card check
    
    // Add booking
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    showBookingInline('Booking confirmed! Your flight has been successfully booked.', 'success');
    triggerSuccessSplash();
    
    // Close modal and reset form
    closeModal();
    event.target.reset();
    
    // Update bookings display and highlight newest
    loadBookings();
    requestAnimationFrame(() => highlightLatestBooking(bookingData.id));
    
    // Scroll to bookings section
    document.getElementById('bookings').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function triggerSuccessSplash() {
    const splash = document.getElementById('successSplash');
    if (!splash) return;
    splash.classList.add('show');
    setTimeout(() => {
        splash.classList.remove('show');
    }, 1600);
}

function showBookingInline(text, type) {
    const box = document.getElementById('bookingInlineMessage');
    if (!box) { showToast(text); return; }
    box.className = `message ${type}`;
    box.textContent = text;
    box.style.display = 'block';
    // Ensure the message is visible
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function moveBookingStep(direction) {
    const steps = document.querySelectorAll('.booking-step');
    const nextBtn = document.getElementById('nextStepBtn');
    const backBtn = document.getElementById('backStepBtn');
    const confirmBtn = document.getElementById('confirmBookingBtn');

    if (!steps.length) return;

    // Validate current step before moving forward
    if (direction > 0 && !validateCurrentStep()) {
        return;
    }

    bookingStepIndex = Math.max(0, Math.min(3, bookingStepIndex + direction));
    updateStepVisibility();
    updateStepperUI();
    updateExtrasFromForm();
    updateTotalPrice();
    updateReviewDetails();

    backBtn.disabled = bookingStepIndex === 0;
    nextBtn.style.display = bookingStepIndex === 3 ? 'none' : 'inline-block';
    confirmBtn.style.display = bookingStepIndex === 3 ? 'inline-block' : 'none';
}

function updateStepVisibility() {
    const steps = document.querySelectorAll('.booking-step');
    steps.forEach(step => {
        const idx = parseInt(step.getAttribute('data-step'), 10);
        step.classList.toggle('active', idx === bookingStepIndex);
    });
}

function updateStepperUI() {
    const steppers = document.querySelectorAll('#bookingStepper .step');
    steppers.forEach((s, idx) => {
        if (idx === bookingStepIndex) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function validateCurrentStep() {
    // Simple per-step validation
    if (bookingStepIndex === 0) {
        const requiredIds = ['firstName', 'lastName', 'email', 'phone'];
        for (const id of requiredIds) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                showBookingInline('Please fill passenger details.', 'error');
                return false;
            }
        }
    }
    if (bookingStepIndex === 2) {
        const requiredIds = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        for (const id of requiredIds) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                showBookingInline('Please fill payment details.', 'error');
                return false;
            }
        }
    }
    return true;
}

function updateExtrasFromForm() {
    const baggage = document.getElementById('baggage');
    const meal = document.getElementById('meal');
    const seat = document.getElementById('seatPref');
    if (baggage) extrasSelection.baggage = parseInt(baggage.value || '0', 10);
    if (meal) extrasSelection.meal = meal.value || 'none';
    if (seat) extrasSelection.seatPref = seat.value || 'auto';
}

function calculateExtrasPrice() {
    let total = 0;
    // Baggage
    if (extrasSelection.baggage === 1) total += 800;
    if (extrasSelection.baggage === 2) total += 1500;
    // Meal
    if (extrasSelection.meal === 'veg') total += 250;
    if (extrasSelection.meal === 'nonveg') total += 300;
    // Seat
    if (extrasSelection.seatPref === 'window' || extrasSelection.seatPref === 'aisle') total += 150;
    if (extrasSelection.seatPref === 'extra_legroom') total += 600;
    return total;
}

function calculateGrandTotal() {
    const base = selectedFlight ? selectedFlight.price : 0;
    return base + calculateExtrasPrice();
}

function updateTotalPrice() {
    const totalPriceEl = document.getElementById('totalPrice');
    if (!totalPriceEl) return;
    totalPriceEl.textContent = `₹${calculateGrandTotal().toLocaleString('en-IN')}`;
}

function updateReviewDetails() {
    const review = document.getElementById('reviewDetails');
    if (!review || !selectedFlight) return;
    review.innerHTML = `
        <div class="flight-summary-item"><span>Base Fare:</span><span>₹${selectedFlight.price.toLocaleString('en-IN')}</span></div>
        <div class="flight-summary-item"><span>Extras:</span><span>₹${calculateExtrasPrice().toLocaleString('en-IN')}</span></div>
        <div class="flight-summary-item"><span>Total:</span><span>₹${calculateGrandTotal().toLocaleString('en-IN')}</span></div>
    `;
}

function validatePayment(payment) {
    // Basic validation - in a real app, this would be more comprehensive
    const cardNumber = payment.cardNumber.replace(/\s/g, '');
    const expiryDate = payment.expiryDate;
    const cvv = payment.cvv;
    
    if (cardNumber.length < 13 || cardNumber.length > 19) return false;
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    if (cvv.length < 3 || cvv.length > 4) return false;
    
    return true;
}

function generateBookingId() {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">No bookings found. Search and book a flight to see your reservations here.</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => {
        const fromAirport = airports.find(a => a.code === booking.flight.from);
        const toAirport = airports.find(a => a.code === booking.flight.to);
        
        return `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-header">
                    <div class="booking-id">Booking ID: ${booking.id}</div>
                    <div class="booking-status status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
                </div>
                <div class="booking-details">
                    <p><strong>Passenger:</strong> ${booking.passenger.firstName} ${booking.passenger.lastName}</p>
                    <p><strong>Flight:</strong> ${booking.flight.airline} ${booking.flight.flightNumber}</p>
                    <p><strong>Route:</strong> ${fromAirport.city} (${fromAirport.code}) → ${toAirport.city} (${toAirport.code})</p>
                    <p><strong>Departure:</strong> ${booking.flight.departureTime} on ${formatDate(booking.flight.departureDate)}</p>
                    <p><strong>Total Price:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</p>
                    <p><strong>Booking Date:</strong> ${formatDate(booking.bookingDate)}</p>
                </div>
            </div>
        `;
    }).join('');
}

function highlightLatestBooking(id) {
    const card = document.querySelector(`.booking-card[data-booking-id="${id}"]`);
    if (!card) return;
    card.classList.add('highlight');
    setTimeout(() => card.classList.remove('highlight'), 2000);
}

function generateMoreFlights() {
    // Generate additional flights for different routes
    const additionalFlights = [
        {
            id: 6,
            airline: 'Oceanic Airlines',
            flightNumber: 'OA401',
            from: 'SFO',
            to: 'LHR',
            departureTime: '22:30',
            arrivalTime: '14:45',
            departureDate: '2024-02-16',
            arrivalDate: '2024-02-17',
            duration: '11h 15m',
            stops: 0,
            price: 899,
            class: 'economy'
        },
        {
            id: 7,
            airline: 'Continental Express',
            flightNumber: 'CE501',
            from: 'ORD',
            to: 'CDG',
            departureTime: '18:15',
            arrivalTime: '08:30',
            departureDate: '2024-02-18',
            arrivalDate: '2024-02-19',
            duration: '8h 15m',
            stops: 0,
            price: 749,
            class: 'economy'
        },
        {
            id: 8,
            airline: 'Pacific Wings',
            flightNumber: 'PW601',
            from: 'LAX',
            to: 'NRT',
            departureTime: '13:45',
            arrivalTime: '16:20',
            departureDate: '2024-02-20',
            arrivalDate: '2024-02-21',
            duration: '12h 35m',
            stops: 0,
            price: 1099,
            class: 'economy'
        }
    ];
    
    sampleFlights.push(...additionalFlights);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the search form
    const searchForm = document.getElementById('flightSearchForm');
    searchForm.insertBefore(messageDiv, searchForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states and animations
function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Initialize date inputs with proper min dates
function initializeDateInputs() {
    const today = new Date();
    const departureInput = document.getElementById('departureDate');
    const returnInput = document.getElementById('returnDate');
    
    departureInput.min = today.toISOString().split('T')[0];
    returnInput.min = today.toISOString().split('T')[0];
}

// Call initialization
initializeDateInputs();
