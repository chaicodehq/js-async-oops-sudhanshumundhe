/**
 * ☕ Tapri ki Chai - Promise Creation: new Promise, resolve, reject
 *
 * Tapri pe chai order karna ek Promise hai — ya toh milegi, ya nahi milegi!
 * Promise ka basic concept seekho: new Promise banana, resolve aur reject
 * karna. Chai ki tapri pe kuch orders valid hain, kuch nahi — bilkul
 * real life jaisa!
 *
 * Prices: { cutting: 10, special: 20, ginger: 15, masala: 25 }
 *
 * Function: orderChai(type, quantity)
 *   - Returns a new Promise
 *   - Valid types: "cutting", "special", "ginger", "masala"
 *   - If type is invalid: reject with Error message "Yeh chai available nahi hai!"
 *   - If quantity <= 0 or not a number: reject with Error message "Kitni chai chahiye bhai?"
 *   - If valid: resolve with { type, quantity, total: price * quantity }
 *     (use setTimeout with 100ms delay to simulate preparation)
 *
 * Function: checkIngredients(ingredient)
 *   - Returns a new Promise
 *   - Valid ingredients: ["tea", "milk", "sugar", "ginger", "cardamom"]
 *   - If ingredient is in the list: resolve with { ingredient, available: true }
 *   - If not: reject with Error message "${ingredient} khatam ho gaya!"
 *
 * Function: prepareChaiWithTimeout(type, timeoutMs)
 *   - Returns a Promise that uses Promise.race
 *   - Race between:
 *     1. orderChai(type, 1) — the actual chai preparation
 *     2. A timeout Promise that rejects after timeoutMs with
 *        Error message "Bahut der ho gayi, chai nahi bani!"
 *   - If chai is ready before timeout: resolves with chai order
 *   - If timeout fires first: rejects with timeout error
 *
 * Function: processChaiQueue(orders)
 *   - Takes array of { type, quantity } objects
 *   - Processes each order using orderChai
 *   - Returns Promise that resolves with array of results
 *   - Each result: { status: "fulfilled", value: orderResult }
 *     or { status: "rejected", reason: errorMessage }
 *   - Like Promise.allSettled behavior — ALL orders are attempted,
 *     failures don't stop other orders
 *   - Agar orders array empty hai, resolve with empty array
 *
 * Rules:
 *   - Always return new Promise (not just values)
 *   - Use reject with Error objects, not plain strings
 *   - orderChai must have simulated delay (setTimeout)
 *   - Type checking is case-sensitive
 *   - processChaiQueue must handle mixed valid/invalid orders
 *   - prepareChaiWithTimeout must clean up properly
 *
 * @param {string} type - Chai ka type
 * @param {number} quantity - Kitni chai chahiye
 * @returns {Promise<{type: string, quantity: number, total: number}>}
 *
 * @example
 *   await orderChai("masala", 2);
 *   // => { type: "masala", quantity: 2, total: 50 }
 *
 *   await orderChai("green", 1);
 *   // => Rejects: "Yeh chai available nahi hai!"
 *
 *   await checkIngredients("milk");
 *   // => { ingredient: "milk", available: true }
 *
 *   await processChaiQueue([
 *     { type: "masala", quantity: 1 },
 *     { type: "invalid", quantity: 2 }
 *   ]);
 *   // => [
 *   //   { status: "fulfilled", value: { type: "masala", quantity: 1, total: 25 } },
 *   //   { status: "rejected", reason: "Yeh chai available nahi hai!" }
 *   // ]
 */
export function orderChai(type, quantity) {
  // Your code here

  return new Promise((resolve, reject) => {
    const prices = { cutting: 10, special: 20, ginger: 15, masala: 25 };

    if (!["cutting", "special", "ginger", "masala"].includes(type)) {
      return reject(new Error("Yeh chai available nahi hai!"));
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return reject(new Error("Kitni chai chahiye bhai?"));
    }

    setTimeout(() => {
      resolve({ type, quantity, total: prices[type] * quantity });
    }, 100);
  });
}

export function checkIngredients(ingredient) {
  // Your code here

  return new Promise((resolve, reject) => {
    const ingredients = ["tea", "milk", "sugar", "ginger", "cardamom"];

    if (!ingredients.includes(ingredient)) {
      return reject(new Error(`${ingredient} khatam ho gaya!`));
    }

    resolve({ ingredient, available: true });
  });
}

export function prepareChaiWithTimeout(type, timeoutMs) {
  // Your code here

  const chaiPromise = orderChai(type, 1);

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error("Bahut der ho gayi, chai nahi bani!"));
    }, timeoutMs)
  );

  return Promise.race([chaiPromise, timeoutPromise]);
}

export async function processChaiQueue(orders) {
  // Your code here

  if (!Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const promises = orders.map((order) =>
    orderChai(order.type, order.quantity)
  );

  const results = await Promise.allSettled(promises);

  return results.map((res) => {
    if (res.status === "rejected") {
      return {
        status: "rejected",
        reason: res.reason.message,
      };
    }
    return res;
  });
}