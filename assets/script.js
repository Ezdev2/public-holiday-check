// Default country and year
let countryCode = 'MG';
let year = new Date().getFullYear();
let language = 'en'; 

// Translations
const translations = {
    en: {
        title: "Public Holidays Tracker",
        dateHeader: "Date",
        holidayNameHeader: "Holiday Name",
        localNameHeader: "Local Name",
        fetchButton: "Fetch Holidays"
    },
    fr: {
        title: "Suivi des Jours Fériés",
        dateHeader: "Date",
        holidayNameHeader: "Nom de la fête",
        localNameHeader: "Nom local",
        fetchButton: "Obtenir les jours fériés"
    }
};

// Function to fetch holidays based on user input
async function fetchHolidays() {
    // Get country code and year from inputs
    countryCode = document.getElementById('countryCode').value || countryCode;

    const apiUrl = `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Clear existing table rows
        const tableBody = document.getElementById('holidaysTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        // Get language-specific formatting options
        const locale = language === 'fr' ? 'fr-FR' : 'en-GB';  // French or English locale

        // Populate table with new data
        data.forEach(holiday => {
            const row = tableBody.insertRow();
            const dateCell = row.insertCell(0);
            const nameCell = row.insertCell(1);
            const localNameCell = row.insertCell(2);

            // Format the date using the locale
            const formattedDate = formatDate(holiday.date, locale);

            dateCell.textContent = formattedDate;
            nameCell.textContent = holiday.name;
            localNameCell.textContent = holiday.localName;
        });

        // Update country flag
        updateCountryFlag();
    } catch (error) {
        alert('Error fetching holiday data. Please try again later.');
    }
}

// Helper function to format the date based on the locale
function formatDate(dateString, locale) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    if (locale === 'en-GB') {
        const day = date.getDate();
        const daySuffix = ['th', 'st', 'nd', 'rd'][(day % 10) - 1] || 'th';
        const formattedDay = `${day}${daySuffix}`;
        const formattedDate = new Intl.DateTimeFormat(locale, { ...options, day: 'numeric' }).format(date);
        return formattedDate.replace(day, formattedDay);
    }

    // For French, use simple date formatting
    return new Intl.DateTimeFormat(locale, options).format(date);
}

// Update the flag based on country code
function updateCountryFlag() {
    const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
    document.getElementById('countryFlag').src = flagUrl;
}

// Change language function
function changeLanguage() {
    language = document.getElementById('languageSelector').value;

    // Change text content for the selected language
    document.getElementById('appTitle').textContent = translations[language].title;
    document.getElementById('dateHeader').textContent = translations[language].dateHeader;
    document.getElementById('holidayNameHeader').textContent = translations[language].holidayNameHeader;
    document.getElementById('localNameHeader').textContent = translations[language].localNameHeader;
    document.querySelector('button').textContent = translations[language].fetchButton;

    fetchHolidays();
}

fetchHolidays();

// Fetch country codes from the API and populate the datalist
async function fetchCountryCodes() {
    const apiUrl = 'https://restcountries.com/v3.1/all'; // API endpoint for all countries
    try {
        const response = await fetch(apiUrl);
        const countries = await response.json();

        // Get datalist element
        const countryList = document.getElementById('countryList');
        countryList.innerHTML = ''; // Clear existing options

        // Loop through the countries and add their code and name to the datalist
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2; // Country code (2-letter code)
            option.textContent = `${country.cca2} - ${country.name.common}`; // Display country code and name
            countryList.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching country codes:', error);
    }
}

// fetchCountryCodes when page loads
window.onload = function() {
    fetchCountryCodes();
};