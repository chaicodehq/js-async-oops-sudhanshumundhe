/**
 * 🚂 IRCTC Train Ticket Booking - async/await
 *
 * IRCTC pe train ticket book karna India ka sabse mushkil kaam hai! Lekin
 * async/await se yeh kaam asan ho jaata hai. Simulate karo API calls ko
 * async functions se — seat check karo, ticket book karo, cancel karo,
 * aur status check karo. Sab kuch await se sequentially hoga.
 *
 * Function: checkSeatAvailability(trainNumber, date, classType)
 *   - async function, returns a Promise
 *   - Simulates API call with a small delay (~100ms)
 *   - Validates trainNumber: must be a string of exactly 5 digits (e.g., "12345")
 *   - Validates classType: must be one of "SL", "3A", "2A", "1A"
 *   - Validates date: must be a non-empty string
 *   - If invalid trainNumber: throws Error "Invalid train number! 5 digit hona chahiye."
 *   - If invalid classType: throws Error "Invalid class type!"
 *   - If invalid date: throws Error "Date required hai!"
 *   - If valid: returns {
 *       trainNumber, date, classType,
 *       available: true/false (randomly, ~70% chance true),
 *       seats: random number 0-50,
 *       waitlist: random number 0-20
 *     }
 *   - If seats > 0, available = true; if seats === 0, available = false
 *
 * Function: bookTicket(passenger, trainNumber, date, classType)
 *   - async function
 *   - passenger is { name, age, gender } object
 *   - Validates passenger has name, age, gender
 *   - Awaits checkSeatAvailability(trainNumber, date, classType)
 *   - If available: returns {
 *       pnr: "PNR" + Math.floor(Math.random() * 1000000),
 *       passenger, trainNumber, date,
 *       class: classType,
 *       status: "confirmed",
 *       fare: calculated (SL:250, 3A:800, 2A:1200, 1A:2000)
 *     }
 *   - If not available: returns with status: "waitlisted", waitlistNumber: random 1-20
 *
 * Function: cancelTicket(pnr)
 *   - async function
 *   - Simulates cancellation with small delay
 *   - Validates pnr: must be a non-empty string starting with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: "cancelled", refund: random amount 100-1000 }
 *
 * Function: getBookingStatus(pnr)
 *   - async function
 *   - Simulates status check with small delay
 *   - Validates pnr: must start with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: random from ["confirmed", "waitlisted", "cancelled"],
 *     lastUpdated: new Date().toISOString() }
 *
 * Function: bookMultipleTickets(passengers, trainNumber, date, classType)
 *   - async function
 *   - Takes array of passenger objects
 *   - Books for EACH passenger SEQUENTIALLY (await in loop, one by one)
 *   - Returns array of booking results (each is bookTicket result or error object)
 *   - If individual booking fails, catch error and include { passenger, error: message }
 *     in results, continue with next passenger
 *   - Agar passengers array empty, return empty array
 *
 * Function: raceBooking(trainNumbers, passenger, date, classType)
 *   - async function
 *   - Takes array of trainNumbers
 *   - Tries booking on ALL trains in PARALLEL
 *   - Returns first successful booking using Promise.any-like approach
 *   - If all fail, throws Error "Koi bhi train mein seat nahi mili!"
 *   - Hint: use Promise.any or map trainNumbers to bookTicket promises
 *
 * Rules:
 *   - ALL functions must be async
 *   - Use await for sequential operations
 *   - bookMultipleTickets must be sequential (one after another)
 *   - raceBooking must be parallel (all at once)
 *   - Proper error handling with try/catch
 *   - Train number format: exactly 5 digit string
 *   - PNR format: starts with "PNR"
 *
 * @example
 *   const availability = await checkSeatAvailability("12345", "2025-01-15", "3A");
 *   // => { trainNumber: "12345", date: "2025-01-15", classType: "3A",
 *   //      available: true, seats: 35, waitlist: 5 }
 *
 * @example
 *   const booking = await bookTicket(
 *     { name: "Rahul", age: 28, gender: "M" },
 *     "12345", "2025-01-15", "3A"
 *   );
 *   // => { pnr: "PNR483921", passenger: {...}, trainNumber: "12345",
 *   //      date: "2025-01-15", class: "3A", status: "confirmed", fare: 800 }
 *
 * @example
 *   const results = await bookMultipleTickets(
 *     [{ name: "Amit", age: 30, gender: "M" }, { name: "Priya", age: 25, gender: "F" }],
 *     "12345", "2025-01-15", "SL"
 *   );
 *   // => [{ pnr: "PNR...", ...}, { pnr: "PNR...", ...}]
 */
export async function checkSeatAvailability(trainNumber, date, classType) {
  // Your code here
  return new Promise((resolve, reject) => {
    if (trainNumber.length != 5 || !trainNumber.split('').every((ele) => parseInt(ele))) {
      throw new Error('Invalid train number! 5 digit hona chahiye.')
    }

    if (!['SL', '3A', '2A', '1A'].includes(classType)) {
      throw new Error('Invalid class type!')
    }
    if (date === '') {
      throw new Error('Date required hai!')
    }

    const seats = Math.trunc(Math.random() * 50)
    setTimeout(() => {
      resolve({
        trainNumber, date, classType,
        available: (seats > 0) ? true : false, seats,
        waitlist: Math.trunc(Math.random() * 20)
      })
    }, 100)
  })

}


export async function bookTicket(passenger, trainNumber, date, classType) {
  if (!passenger || !passenger.name || !passenger.age || !passenger.gender) {
    throw new Error("Passenger details missing!");
  }

  const availability = await checkSeatAvailability(trainNumber, date, classType);

  const fares = { SL: 250, "3A": 800, "2A": 1200, "1A": 2000 };
  const pnr = "PNR" + Math.floor(Math.random() * 1000000);

  if (availability.available) {
    return {
      pnr,
      passenger,
      trainNumber,
      date,
      class: classType,
      status: "confirmed",
      fare: fares[classType]
    };
  } else {
    return {
      pnr,
      passenger,
      trainNumber,
      date,
      class: classType,
      status: "waitlisted",
      waitlistNumber: Math.floor(Math.random() * 20) + 1
    };
  }
}


export async function cancelTicket(pnr) {
  // Your code here

  const refund = Math.floor(Math.random() * 901) + 100;
  return new Promise((res, rej) => {
    if (pnr.trim().length === 0 || !pnr.startsWith("PNR")) {
      return rej(new Error("Invalid PNR number!"));
    }
    setTimeout(() => {
      res({ pnr, status: "cancelled", refund });
    }, 100);
  });
}

export async function getBookingStatus(pnr) {
  // Your code here
  const statusArr = ["confirmed", "waitlisted", "cancelled"]
  if (pnr == '' || !pnr.startsWith('PNR')) {
    throw new Error('Invalid PNR number!')
  }
  return {
    pnr, status: statusArr[Math.trunc(Math.random() * 2)], lastUpdated: new Date().toISOString()
  }

}


export async function bookMultipleTickets(
  // Your code here

  passengers,
  trainNumber,
  date,
  classType,
) {
  if (passengers.length === 0) return [];

  const result = [];

  for (const passenger of passengers) {
    try {
      const res = await bookTicket(passenger, trainNumber, date, classType);
      result.push(res);
    } catch (error) {
      result.push({ passenger, error: error.message });
    }
  }

  return result;
}

export async function raceBooking(trainNumbers, passenger, date, classType) {
  // Your code here
  const promises = [];

  for (const trainNumber of trainNumbers) {
    promises.push(bookTicket(passenger, trainNumber, date, classType));
  }

  try {
    return await Promise.any(promises);
  } catch (error) {
    throw new Error("Koi bhi train mein seat nahi mili!");
  }
}
